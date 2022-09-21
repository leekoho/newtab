import { BadGatewayException, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom, map, of } from 'rxjs'
import { AxiosError, AxiosResponse } from 'axios'
import { ConfigService } from '@nestjs/config'
import { stringify } from 'querystring'

@Injectable()
export class MaimaiHelper {
  private readonly baseUrl = 'https://open.taou.com/maimai'
  private accessToken = ''
  private userId = ''
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.fetchHotList = this.fetchHotList.bind(this)
  }

  login() {
    const url = `${this.baseUrl}/account/v5/verify_reg_login_code_v3?access_token=&appid=4&channel=AppStore&density=2&device=iPhone11%2C8&launch_uuid=e7445ef6ad034a6188afc7861aa5a21c&net=wifi&push_permit=0&rn_version=0.63.2&screen_height=1792&screen_width=828&session_uuid=b5482c68c6f14db580e5365fd239fa75&sm_did=D2iSsfISPW2rf5/m6c5NKKrR0o93v9R4YFDeeETUoYK3wXfe&udid=a60b7b379d7e425bbad2799f86cd82de&vc=15.2.1&version=6.1.60&webviewUserAgent=Mozilla/5.0%20%28iPhone%3B%20CPU%20iPhone%20OS%2015_2_1%20like%20Mac%20OS%20X%29%20AppleWebKit/605.1.15%20%28KHTML%2C%20like%20Gecko%29%20Mobile/15E148`
    return firstValueFrom(
      this.httpService
        .post(
          url,
          stringify({
            dev_type: 4,
            launch_cnt: 3,
            mobile: this.configService.get<string>('MAIMAI_AUTH_MOBILE'),
            need_script: '1',
            new_fr: '1',
            password: this.configService.get<string>('MAIMAI_AUTH_PASSWORD'),
            stage: 'complete_uinfo',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .pipe(
          map((response: AxiosResponse) => {
            const data = response.data.info
            this.accessToken = data.token
            this.userId = data.user.id
          }),
          catchError((error: AxiosError) => {
            const { response: data } = error
            console.log(error)
            return of(error)
          })
        )
    )
  }

  fetchHotList(idx = 0) {
    if (idx > 2) throw new BadGatewayException('脉脉热榜数据获取失败')

    const url = `${this.baseUrl}/feed/v6/hot_posts_list?access_token=${this.accessToken}&appid=4&u=${this.userId}&version=6.1.60&count=16`
    return firstValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse) => response.data.feeds),
        catchError(async (error: AxiosError<{ error_code: number; error_msg: string }>) => {
          idx++
          const {
            response: { data },
          } = error
          if (data.error_code === 20002) {
            await this.login()
            return await this.fetchHotList(idx)
          } else {
            console.log(error)
            throw new BadGatewayException(data.error_msg)
          }
        })
      )
    )
  }
}
