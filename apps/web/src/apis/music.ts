import instance from '@/plugins/axios'

enum API {
  TopPlaylist = '/music/top/playlist',
  PlaylistDetail = '/music/playlist/detail',
}

export declare interface GetTopPlaylistQuery {
  cat: string
  order?: string
  limit?: number
  offset?: number
}

export declare interface GetPlaylistDetailQuery {
  id: number
  // 歌单最近的 s 个收藏者,默认为8
  s?: number
}

export interface PlaylistModel {
  id: number
  name: string
  trackIds: [number]
}

export const getTopPlaylist = (query: GetTopPlaylistQuery) =>
  instance.get<PlaylistModel[]>(`${API.TopPlaylist}`, {
    params: query,
  })

export const getPlaylistDetail = (query: GetPlaylistDetailQuery) =>
  instance.get(`${API.PlaylistDetail}`, {
    params: query,
  })
