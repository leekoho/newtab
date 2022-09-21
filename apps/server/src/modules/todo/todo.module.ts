import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoController } from '@/modules/todo/todo.controller'
import { TodoService } from '@/modules/todo/todo.service'
import { TodoEntity } from '@/modules/todo/todo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
