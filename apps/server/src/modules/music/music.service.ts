import { Injectable } from '@nestjs/common'
import { NeteaseCloudMusicHelper, GetTopPlaylistsDto } from '@/helpers/netease-cloud-music.helper'

@Injectable()
export class MusicService {
  constructor(private readonly neteaseCloudMusicHelper: NeteaseCloudMusicHelper) {}

  async getTopPlaylist(data: GetTopPlaylistsDto) {
    const { playlists } = await this.neteaseCloudMusicHelper.fetchTopPlaylist(data)
    const playlistsDetail = await Promise.all(
      playlists.map(t => this.neteaseCloudMusicHelper.fetchPlaylistDetail(t.id))
    )
    return playlistsDetail.map(t => ({
      id: t.playlist.id,
      name: t.playlist.name,
      trackIds: t.playlist.trackIds.map(v => v.id),
    }))
  }
}
