import { BadGatewayException, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom, map } from 'rxjs'
import { AxiosError, AxiosResponse } from 'axios'
import { Element, load } from 'cheerio'

export interface IHupuHotListItem {
  title: string
  url: string
  likeCount: number
  replyCount: number
  category: string
}

@Injectable()
export class HupuHelper {
  // https://bbs.hupu.com/all-gambia
  private readonly baseUrl = 'https://bbs.hupu.com'
  constructor(private readonly httpService: HttpService) {}

  fetchHotList(): Promise<IHupuHotListItem[]> {
    return firstValueFrom(
      this.httpService
        .request({
          method: 'get',
          url: `${this.baseUrl}/all-gambia`,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
          },
        })
        .pipe(
          map(
            (response: AxiosResponse) => {
              const html = response.data
              const $ = load(html)
              return $('.list-wrap > .list-item')
                .map((index: number, item: Element) => {
                  const itemTag = $(item)
                  const titleTag = itemTag.find('.t-title')
                  return {
                    title: titleTag.text().trim(),
                    url: `${this.baseUrl}${titleTag.parent().attr('href')}`,
                    likeCount: parseInt(itemTag.find('.t-lights').text().trim().replace('亮', '')),
                    replyCount: parseInt(
                      itemTag.find('.t-replies').text().trim().replace('回复', '')
                    ),
                    category: itemTag.find('.t-label').text().trim(),
                  }
                })
                .toArray()
            },
            catchError((error: AxiosError) => {
              console.log(error)
              throw new BadGatewayException('虎扑步行街列表数据获取失败')
            })
          )
        )
    )
  }
}
