import helmet from 'helmet'
import * as compression from 'compression'
import rateLimit from 'express-rate-limit'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '@/app.module'
import { LoggingInterceptor } from '@/interceptors/logging.interceptor'
import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { ErrorsInterceptor } from '@/interceptors/exception.interceptor'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'
import { ValidationPipe } from '@/pipes/validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})
  // Helmet通过设置各种HTTP标头来帮助您保护Express应用程序。
  app.use(helmet())
  // 压缩
  app.use(compression())
  // 速率限制
  app.use(
    rateLimit({
      max: 100, // limit each IP to 100 requests per windowMs
      windowMs: 15 * 60 * 1000, // 15 minutes
      // message: { message: HTTP_TOO_MANY_REQUESTS_TEXT },
    })
  )
  // 开启跨域
  app.enableCors()
  // 设置全局拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new ErrorsInterceptor()
  )
  // 设置全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 设置全局管道
  // app.useGlobalPipes(new ValidationPipe())
  // 设置接口前缀
  app.setGlobalPrefix('apis')
  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>('APP_SERVER_PORT'))
}

bootstrap()
