import { NewsChannelEnum } from '@/enums'
import { IsEnum } from 'class-validator'

export class GetNewsListDto {
  @IsEnum({ enum: NewsChannelEnum })
  channel: NewsChannelEnum
}
