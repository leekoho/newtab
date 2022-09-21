import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { UserEntity } from '@/modules/user/user.entity'
import { UserService } from '@/modules/user/user.service'

@Injectable()
export class UserByUsernamePipe implements PipeTransform<string, Promise<UserEntity>> {
  constructor(protected readonly userService: UserService) {}
  async transform(username: string, metadata: ArgumentMetadata): Promise<UserEntity> {
    const user: UserEntity = await this.userService.findByUsername(username)
    if (!user) {
      throw new NotFoundException(`未找到用户名为「${username}」的用户`)
    }
    return user
  }
}
