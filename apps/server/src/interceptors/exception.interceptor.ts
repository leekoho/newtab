import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HTTP_EXCEPTION_TEXT, LOGGER_CONTEXT_TEXT } from '@/constants/text.constant'

// return next.handle().pipe(catchError(err => throwError(err)))

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err =>
        throwError(() => {
          Logger.error('报错: ', err, LOGGER_CONTEXT_TEXT.EXCEPTION_INTERCEPTOR)
          const isHttpException = err instanceof HttpException
          if (isHttpException) return err

          return new InternalServerErrorException(
            err.response,
            HTTP_EXCEPTION_TEXT.INTERNAL_SERVER_ERROR
          )
        })
      )
    )
  }
}
