import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HTTP_DEFAULT_SUCCESS_TEXT } from '@/constants/text.constant'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => ({
        status: HTTP_DEFAULT_SUCCESS_TEXT,
        data,
      }))
    )
  }
}
