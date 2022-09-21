import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { Repository } from 'typeorm'
import { NewsEntity } from '@/modules/news/news.entity'
import { ZhihuHelper } from '@/helpers/zhihu.helper'
import { NewsChannelEnum } from '@/enums'
import { Interval } from '@nestjs/schedule'
import { HupuHelper } from '@/helpers/hupu.helper'
import { MaimaiHelper } from '@/helpers/maimai.helper'

// 6hour(second)
const TTL_TIME = 60 * 60 * 6

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
    private readonly zhihuHelper: ZhihuHelper,
    private readonly hupuHelper: HupuHelper,
    private readonly maimaiHelper: MaimaiHelper,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {
    this.getZhihuHotList = this.getZhihuHotList.bind(this)
    this.getHupuHotList = this.getHupuHotList.bind(this)
    this.getMaimaiHotList = this.getMaimaiHotList.bind(this)
  }

  async getLocalList(channel: NewsChannelEnum) {
    const hotList = await (<Promise<NewsEntity[]> | undefined>this.cacheManager.get(channel))

    if (!hotList?.length) {
      await this.save(channel)
    }
    return this.cacheManager.get(channel)
  }

  async save(channel: NewsChannelEnum): Promise<boolean> {
    const getListFuncMap: Record<NewsChannelEnum, () => Promise<NewsEntity[]>> = {
      [NewsChannelEnum.Zhihu]: this.getZhihuHotList,
      [NewsChannelEnum.Hupu]: this.getHupuHotList,
      [NewsChannelEnum.Maimai]: this.getMaimaiHotList,
    }
    if (!getListFuncMap[channel]) return false

    const hotList = await getListFuncMap[channel]()

    return this.cacheManager
      .set(channel, hotList, { ttl: TTL_TIME })
      .then(() => {
        Logger.log(`${channel}热榜数据缓存成功`, 'NewsService')
        return true
      })
      .catch(err => {
        Logger.error(`${channel}热榜数据缓存失败`, 'NewsService')
        Logger.error(err, 'NewsServices')
        return false
      })
  }

  async getZhihuHotList(): Promise<NewsEntity[]> {
    const response = await this.zhihuHelper.fetchHotList()
    const { data } = response
    return data.map(
      t => new NewsEntity(t.question.title, t.question.url, '', NewsChannelEnum.Zhihu)
    )
  }

  async getHupuHotList(): Promise<NewsEntity[]> {
    const data = await this.hupuHelper.fetchHotList()
    return data.map(t => new NewsEntity(t.title, t.url, t.category, NewsChannelEnum.Hupu))
  }

  async getMaimaiHotList(): Promise<NewsEntity[]> {
    const data = await this.maimaiHelper.fetchHotList()
    return data
      .map(item => {
        const textFieldKeys = Object.keys(item).filter(t => t.startsWith('style'))
        let textKey = ''
        if (textFieldKeys.length && textFieldKeys[0]) {
          textKey = textFieldKeys[0]
        }
        return new NewsEntity(
          item[textKey].text || '',
          item[textKey].share_url || '',
          item.common?.hot_info || '',
          NewsChannelEnum.Maimai
        )
      })
      .filter(item => Boolean(item.title && item.url))
  }

  @Interval(1000 * TTL_TIME)
  saveZhihuHotList() {
    return this.save(NewsChannelEnum.Zhihu)
  }

  @Interval(1000 * TTL_TIME)
  saveHupuHotList() {
    return this.save(NewsChannelEnum.Hupu)
  }

  @Interval(1000 * TTL_TIME)
  saveMaimaiHotList() {
    return this.save(NewsChannelEnum.Maimai)
  }
}
