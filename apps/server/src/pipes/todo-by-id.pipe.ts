import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { TodoEntity } from '@/modules/todo/todo.entity'
import { TodoService } from '@/modules/todo/todo.service'

@Injectable()
export class TodoByIdPipe implements PipeTransform<string, Promise<TodoEntity>> {
  constructor(protected readonly todoService: TodoService) {}
  async transform(id: string, metadata: ArgumentMetadata): Promise<TodoEntity> {
    const todo: TodoEntity = await this.todoService.findById(id)
    if (!todo) {
      throw new NotFoundException(`未找到id为「${id}」的代办事项`)
    }
    return todo
  }
}
