import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { constants, createCipheriv, createHash, publicEncrypt, randomBytes } from 'crypto'
import { parse, stringify } from 'querystring'
import { firstValueFrom, map } from 'rxjs'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface INeteaseCloudMusicPlaylists {
  code: number
  playlists: [{ id: number; name: string; trackCount: number }]
  total: number
  more: boolean
  cat: string
}

export interface INeteaseCloudMusicPlaylistDetail {
  code: number
  playlist: {
    id: number
    name: string
    trackIds: [
      {
        id: number
      }
    ]
  }
}

export class GetTopPlaylistsDto {
  public cat: string
  public order?: string
  public limit: number
  public offset: number
  public total?: boolean
}

@Injectable()
export class NeteaseCloudMusicHelper {
  private readonly base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  private readonly presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
  private readonly iv = Buffer.from('0102030405060708')
  private readonly publicKey =
    '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'
  private readonly eapiKey = 'e82ckenh8dichen8'

  constructor(private readonly httpService: HttpService) {
    // this.httpService.axiosRef.interceptors.request.use(config => {
    //
    // })
    // this.httpService.axiosRef.interceptors.response.use(response => {
    //   if ([200, 201, 302, 400, 502, 800, 801, 802, 803].includes(response.data.code)) {
    //     return response.data
    //   }
    //   return Promise.reject(response)
    // })
  }

  private static randomUserAgent(): string {
    const userAgentList = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
      'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
      'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
      'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
      'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
      'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
  }

  private static aesEncrypt(buffer, mode, key, iv) {
    const cipher = createCipheriv('aes-128-' + mode, key, iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
  }

  private static rsaEncrypt(buffer, key) {
    buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
    return publicEncrypt({ key: key, padding: constants.RSA_NO_PADDING }, buffer)
  }

  private weapiEncrypt(object) {
    const text = JSON.stringify(object)
    const secretKey = randomBytes(16).map(n => this.base62.charAt(n % 62).charCodeAt(0))
    return {
      params: NeteaseCloudMusicHelper.aesEncrypt(
        Buffer.from(
          NeteaseCloudMusicHelper.aesEncrypt(
            Buffer.from(text),
            'cbc',
            this.presetKey,
            this.iv
          ).toString('base64')
        ),
        'cbc',
        secretKey,
        this.iv
      ).toString('base64'),
      encSecKey: NeteaseCloudMusicHelper.rsaEncrypt(secretKey.reverse(), this.publicKey).toString(
        'hex'
      ),
    }
  }

  private eapiEncrypt(url, object) {
    const text = typeof object === 'object' ? JSON.stringify(object) : object
    const message = `nobody${url}use${text}md5forencrypt`
    const digest = createHash('md5').update(message).digest('hex')
    const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
    return {
      params: NeteaseCloudMusicHelper.aesEncrypt(Buffer.from(data), 'ecb', this.eapiKey, '')
        .toString('hex')
        .toUpperCase(),
    }
  }

  private handleConfig(config: AxiosRequestConfig) {
    if (!config.headers) {
      config.headers = {}
    }
    const { method, url, headers, data } = config
    config.headers['User-Agent'] = NeteaseCloudMusicHelper.randomUserAgent()
    config.headers['Referer'] = 'https://music.163.com'

    if (method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    const crypto = url.replace(/https:\/\/music\.163.com\/(\w+).*/gi, '$1')

    if (crypto === 'weapi') {
      let csrfToken = (<string>headers['Cookie'] || '').match(/_csrf=([^(;|$)]+)/)
      data.csrf_token = csrfToken ? csrfToken[1] : ''
      config.data = stringify(this.weapiEncrypt(data))
      config.url = url.replace(/\w*api/, 'weapi')
    } else if (crypto === 'eapi') {
      const cookie = parse(<string>headers['Cookie'])
      const csrfToken = cookie['__csrf'] || ''
      const header = {
        osver: cookie.osver, //系统版本
        deviceId: cookie.deviceId, //encrypt.base64.encode(imei + '\t02:00:00:00:00:00\t5106025eb79a5247\t70ffbaac7')
        appver: cookie.appver || '8.0.0', // app版本
        versioncode: cookie.versioncode || '140', //版本号
        mobilename: cookie.mobilename, //设备model
        buildver: cookie.buildver || Date.now().toString().substr(0, 10),
        resolution: cookie.resolution || '1920x1080', //设备分辨率
        __csrf: csrfToken,
        os: cookie.os || 'android',
        channel: cookie.channel,
        requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(4, '0')}`,
      }
      if (cookie.MUSIC_U) header['MUSIC_U'] = cookie.MUSIC_U
      if (cookie.MUSIC_A) header['MUSIC_A'] = cookie.MUSIC_A
      headers['Cookie'] = Object.keys(header)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(header[key]))
        .join('; ')
      data.header = header
      config.data = stringify(this.eapiEncrypt(url, data))
      config.url = url.replace(/\w*api/, 'eapi')
    } else {
      config.data = stringify(data)
    }
    return config
  }

  private handleResponse(response: AxiosResponse) {
    if ([200, 201, 302, 400, 502, 800, 801, 802, 803].includes(response.data.code)) {
      return response.data
    }
    return Promise.reject(response)
  }

  private createRequest<T>(config): Promise<T> {
    return firstValueFrom(
      this.httpService
        .request(this.handleConfig(config))
        .pipe(map((response: AxiosResponse) => this.handleResponse(response)))
    )
  }

  fetchTopPlaylist(data: GetTopPlaylistsDto): Promise<INeteaseCloudMusicPlaylists> {
    return this.createRequest<INeteaseCloudMusicPlaylists>({
      method: 'POST',
      url: 'https://music.163.com/weapi/playlist/list',
      data,
    })
  }

  fetchPlaylistDetail(id, s = 8): Promise<INeteaseCloudMusicPlaylistDetail> {
    return this.createRequest<INeteaseCloudMusicPlaylistDetail>({
      method: 'POST',
      url: 'https://music.163.com/api/v6/playlist/detail',
      data: {
        id,
        n: 100000,
        s,
      },
    })
  }
}
