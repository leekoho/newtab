import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@/modules/user/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from '@/modules/user/user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { username } })
  }

  /**
   * @description 过滤掉用户隐私的字段
   * @param user
   */
  async protectUserPrivacy(user: UserEntity): Promise<Omit<UserEntity, 'password' | 'salt'>> {
    const { password, salt, ...result } = user
    return result
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt)
    const newUser = Object.assign(createUserDto, {
      salt,
      password: hashedPassword,
    })

    return this.protectUserPrivacy(await this.userRepository.save(newUser))
  }
}
