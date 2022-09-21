import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/modules/base.entity'
import { UserEntity } from '@/modules/user/user.entity'

@Entity('todo')
export class TodoEntity extends BaseEntity {
  @Column()
  name: string

  @Column({ type: 'boolean', default: false })
  completed?: boolean

  @ManyToOne(type => UserEntity, user => user.todos)
  user: UserEntity

  constructor(name: string) {
    super()
    this.name = name
  }
}
