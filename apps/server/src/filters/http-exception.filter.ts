import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { HTTP_DEFAULT_FAILED_TEXT, LOGGER_CONTEXT_TEXT } from '@/constants/text.constant'

interface NestHttpExceptionResponse {
  statusCode?: number
  message: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = <NestHttpExceptionResponse>exception.getResponse()
    const _exception: NestHttpExceptionResponse =
      typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse

    const { statusCode, ...otherException } = _exception
    response.status(status).json({
      status: HTTP_DEFAULT_FAILED_TEXT,
      ...otherException,
    })

    Logger.error(
      `${request.method} ${request.url} query: ${JSON.stringify(
        request.query
      )} params: ${JSON.stringify(request.params)} body: ${JSON.stringify(request.body)}`,
      LOGGER_CONTEXT_TEXT.HTTP_EXCEPTION_FILTER
    )
  }
}
