import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request } from 'express'
import { LOGGER_CONTEXT_TEXT } from '@/constants/text.constant'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const content = request.method + ' -> ' + request.path
    Logger.log(`${content}`, LOGGER_CONTEXT_TEXT.LOGGING_INTERCEPTOR)
    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(` ${content} ${Date.now() - now}ms`, LOGGER_CONTEXT_TEXT.LOGGING_INTERCEPTOR)
        )
      )
  }
}
