import { BaseEntity } from '@/modules/base.entity'
import { Column, Entity } from 'typeorm'
import { NewsChannelEnum } from '@/enums'

@Entity('news')
export class NewsEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string

  @Column({ type: 'varchar', length: 2083 })
  url: string

  @Column({ default: '' })
  extra: string

  @Column({
    type: 'enum',
    enum: NewsChannelEnum,
    default: NewsChannelEnum.Zhihu,
  })
  channel: NewsChannelEnum

  constructor(title: string, url: string, extra: string, channel: NewsChannelEnum) {
    super()
    this.title = title
    this.url = url
    this.extra = extra
    this.channel = channel
  }
}
