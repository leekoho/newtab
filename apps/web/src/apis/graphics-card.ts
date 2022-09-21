import instance from '@/plugins/axios'

enum API {
  Ranking = '/graphics_card_ranking',
}

export interface GraphicsCardModel {
  id: string
  name: string
  score: number
  coreClock: string
  streamPro: string
  memoryRate: string
  memorySize: string
}

export const getGraphicsCardRankingApi = () => instance.get<GraphicsCardModel[]>(API.Ranking)
