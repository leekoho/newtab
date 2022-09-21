import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserEntity } from '@/modules/user/user.entity'
import { UserService } from '@/modules/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { CreateTokenDto } from '@/modules/auth/auth.dto'
import * as bcrypt from 'bcrypt'
import { HTTP_EXCEPTION_TEXT } from '@/constants/text.constant'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(payload): Promise<Partial<UserEntity> | null> {
    const user = await this.userService.findByUsername(payload.username)
    if (user) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async createToken(createTokenDto: CreateTokenDto) {
    const user = await this.userService.findByUsername(createTokenDto.username)
    if (!user) {
      throw new UnauthorizedException(HTTP_EXCEPTION_TEXT.LOGIN_FAIL)
    }

    const _password = bcrypt.hashSync(createTokenDto.password, user.salt)
    if (user.password !== _password) {
      throw new UnauthorizedException(HTTP_EXCEPTION_TEXT.LOGIN_FAIL)
    }
    return {
      ...this.userService.protectUserPrivacy(user),
      accessToken: this.jwtService.sign({ username: createTokenDto.username }),
    }
  }
}
