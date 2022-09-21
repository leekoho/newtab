import instance from '@/plugins/axios'

enum API {
  List = '/news/',
}

interface BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export interface NewsModel extends BaseModel {
  title: string
  url: string
  extra: string
  channel: string
}

export const fetchNewsList = (channel: string) => instance.get<NewsModel[]>(`${API.List}${channel}`)
