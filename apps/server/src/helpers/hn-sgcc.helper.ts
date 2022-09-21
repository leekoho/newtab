import { BadGatewayException, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom, map } from 'rxjs'
import { AxiosError, AxiosResponse } from 'axios'

@Injectable()
export class HnSgccHelper {
  private readonly baseUrl = 'https://wxgzpt.hn.sgcc.com.cn'
  constructor(private readonly httpService: HttpService) {}

  getEnergyAndPhoneByWxOpenId(wxOpenId) {
    return firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/makepower/wxEnergy/getEnergy`, {
          params: { openid: wxOpenId },
        })
        .pipe(
          map((response: AxiosResponse) => {
            const {
              data: { code, data },
            } = response
            if (code === '00000') {
              return {
                energy: data.energyNum,
                phone: data.phoneNumber,
              }
            }
          }),
          catchError((error: AxiosError) => {
            console.log(error)
            throw new BadGatewayException('获取能量值和手机号失败')
          })
        )
    )
  }

  getAccountNumberListByWxOpenId(wxOpenId) {
    return firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/hndlGateway/consumer/consNo/bind/list`, {
          params: { userId: wxOpenId, access: 'wechat' },
        })
        .pipe(
          map((response: AxiosResponse) => {
            const {
              data: { code, data },
            } = response
            if (code === '00000') {
              return data.bindList.map(t => {
                const info = JSON.parse(t.electricityMessage)
                return {
                  id: t.consNo,
                  name: info.userName,
                  address: info.elecAddr,
                }
              })
            }
            return
          }),
          catchError((error: AxiosError) => {
            console.log(error)
            throw new BadGatewayException('获取户号列表失败')
          })
        )
    )
  }
}
