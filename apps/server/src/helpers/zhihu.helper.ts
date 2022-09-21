import { BadGatewayException, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { catchError, firstValueFrom, map } from 'rxjs'

export interface IZhihuHotDataItem {
  question: {
    url: string
    title: string
    id: string
  }
  reaction: {
    score: number
    score_level: number
    pv: number
  }
}

export interface IZhihuHotList {
  data: IZhihuHotDataItem[]
  paging: any
}

@Injectable()
export class ZhihuHelper {
  private readonly baseUrl = 'https://www.zhihu.com/api/v4'
  constructor(private readonly httpService: HttpService) {}

  fetchHotList(): Promise<IZhihuHotList> {
    return firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/creators/rank/hot`, {
          params: {
            domain: 0,
            period: 'hour',
            limit: 50,
            offset: 0,
          },
        })
        .pipe(
          map((response: AxiosResponse) => response.data),
          catchError((error: AxiosError) => {
            console.log(error)
            throw new BadGatewayException('知乎热榜数据获取失败')
          })
        )
    )
  }
}
