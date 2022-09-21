import { Controller, Get, Param, Patch } from '@nestjs/common'
import { NewsService } from '@/modules/news/news.service'
import { NewsChannelEnum } from '@/enums'

@Controller('news')
export class NewsController {
  constructor(private readonly newService: NewsService) {}

  @Get(':channel')
  async getHotList(@Param('channel') channel: NewsChannelEnum) {
    return this.newService.getLocalList(channel)
  }

  @Patch(':channel')
  async resave(@Param('channel') channel: NewsChannelEnum) {
    return this.newService.save(channel)
  }
}
