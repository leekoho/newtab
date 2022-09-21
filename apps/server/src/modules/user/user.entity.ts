import { Column, Entity, Index, OneToMany } from 'typeorm'
import { BaseEntity } from '@/modules/base.entity'
import { TodoEntity } from '@/modules/todo/todo.entity'
import { GenderEnum } from '@/enums'

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  @Index({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  salt: string

  @Column({ default: '' })
  nickname: string

  @Column({ unique: true })
  @Index({ unique: true })
  email: string

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.Male,
  })
  gender: string

  @Column({ default: '' })
  avatarUrl: string

  @OneToMany(type => TodoEntity, todo => todo.user)
  todos: TodoEntity[]
}
