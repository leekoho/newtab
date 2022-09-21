import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { JWT_ERROR_TEXT } from '@/constants/text.constant'
import { JsonWebTokenError } from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }

  handleRequest(err, user, info: JsonWebTokenError) {
    const infoNameMap: Record<string, string> = {
      TokenExpiredError: JWT_ERROR_TEXT.TOKEN_EXPIRED,
      JsonWebTokenError: JWT_ERROR_TEXT.JSON_WEB_TOKEN,
      // 多服务器环境时候，服务器之间时间如果不一致，一台服务器签发的 token 如果立刻被发往另一台服务器验证，就很容易产生 nbf 字段验证不通过的问题。
      NotBeforeError: JWT_ERROR_TEXT.NOT_BEFORE,
    }
    // 可以抛出一个基于info或者err参数的异常
    if (err || !user) {
      throw err || new UnauthorizedException(infoNameMap[info.name])
    }
    return user
  }
}
