import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
// 应用参数配置模块
import { AppConfigModule } from '@/config/app-config.module'
// 辅助模块
import { HelperModule } from '@/helpers/helper.module'
// 数据库模块
import { DatabaseModule } from '@/database/database.module'
// 定时任务模块
import { ScheduleModule } from '@nestjs/schedule'
// 业务模块
import { MusicModule } from '@/modules/music/music.module'
import { TodoModule } from '@/modules/todo/todo.module'
import { UserModule } from '@/modules/user/user.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { NewsModule } from '@/modules/news/news.module'

@Module({
  imports: [
    AppConfigModule,
    HelperModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    MusicModule,
    TodoModule,
    UserModule,
    AuthModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
