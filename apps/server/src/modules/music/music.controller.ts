import { Controller, Get, Query } from '@nestjs/common'
import { MusicService } from './music.service'
import { GetTopPlaylistsDto } from '@/helpers/netease-cloud-music.helper'

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('top/playlist')
  getTopPlaylist(@Query() query: GetTopPlaylistsDto) {
    return this.musicService.getTopPlaylist(query)
  }
}
