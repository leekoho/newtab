import { Global, Logger, Module } from '@nestjs/common'
import { Connection } from 'typeorm'
import { databaseProviders } from './database.provider'
import { LOGGER_CONTEXT_TEXT } from '@/constants/text.constant'

@Global()
@Module({
  imports: [...databaseProviders],
  // providers: [Unique],
})
export class DatabaseModule {
  constructor(private readonly connection: Connection) {
    if (connection.isConnected) {
      Logger.log('数据库连接成功！', LOGGER_CONTEXT_TEXT.DATABASE_MODULE)
    }
  }
}
