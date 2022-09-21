import { Body, Controller, Post } from '@nestjs/common'
import { ValidationPipe } from '@/pipes/validation.pipe'
import { CreateUserDto } from '@/modules/user/user.dto'
import { UserService } from '@/modules/user/user.service'
import { CreateTokenDto } from '@/modules/auth/auth.dto'
import { AuthService } from '@/modules/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Post('login')
  async login(@Body(ValidationPipe) createTokenDto: CreateTokenDto) {
    return this.authService.createToken(createTokenDto)
  }
}
