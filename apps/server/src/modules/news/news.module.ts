import { CacheModule, Module } from '@nestjs/common'
import { NewsController } from '@/modules/news/news.controller'
import { NewsService } from '@/modules/news/news.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NewsEntity } from '@/modules/news/news.entity'

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity]), CacheModule.register()],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
