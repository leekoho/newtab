import { Controller, Get, Param } from '@nestjs/common'
import { UserService } from '@/modules/user/user.service'
import { UserByUsernamePipe } from '@/pipes/user-by-username.pipe'
import { UserEntity } from '@/modules/user/user.entity'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async findOne(@Param('username', UserByUsernamePipe) user: UserEntity) {
    return this.userService.protectUserPrivacy(user)
  }
}
