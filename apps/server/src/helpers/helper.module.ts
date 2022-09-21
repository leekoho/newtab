import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { NeteaseCloudMusicHelper } from './netease-cloud-music.helper'
import { EmailHelper } from '@/helpers/email.helper'
import { ZhihuHelper } from '@/helpers/zhihu.helper'
import { HupuHelper } from '@/helpers/hupu.helper'
import { MaimaiHelper } from '@/helpers/maimai.helper'

const helpers = [NeteaseCloudMusicHelper, EmailHelper, ZhihuHelper, HupuHelper, MaimaiHelper]

@Global()
@Module({
  imports: [HttpModule],
  providers: helpers,
  exports: helpers,
})
export class HelperModule {}
