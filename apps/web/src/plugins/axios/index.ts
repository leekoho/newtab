import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ContentTypeEnum } from '@/enums/http'

// 只需要传入AxiosRequestConfig一部分内容
const createAxios = (opt?: Partial<AxiosRequestConfig>) => {
  return Axios.create({
    baseURL: `/${import.meta.env.APP_API_PREFIX}`,
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    timeout: 20 * 1000,
    timeoutErrorMessage: '请求超时',
    validateStatus: status => [200, 201].includes(status),
    // transform: {},
  })
}

const instance = createAxios()

instance.interceptors.response.use((response: AxiosResponse) => {
  if (response.status === 200) return response.data.data
  return Promise.reject(response.data)
})

export default instance
