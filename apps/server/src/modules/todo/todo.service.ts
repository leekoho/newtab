import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TodoEntity } from '@/modules/todo/todo.entity'
import { UpdateTodoDto } from '@/modules/todo/todo.dto'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>
  ) {}

  findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.find()
  }

  findById(id: string): Promise<TodoEntity> {
    return this.todoRepository.findOne({
      where: {
        id,
      },
    })
  }

  findByCompleted(completed: boolean): Promise<TodoEntity[]> {
    return this.todoRepository.find({
      where: {
        completed,
      },
    })
  }

  create(name: string): Promise<TodoEntity> {
    return this.todoRepository.save(new TodoEntity(name))
  }

  remove(todo: TodoEntity): Promise<TodoEntity> {
    return this.todoRepository.softRemove(todo)
  }

  async update(todo: TodoEntity, dto: UpdateTodoDto): Promise<TodoEntity> {
    const updated = Object.assign(todo, dto)
    return this.todoRepository.save(updated)
  }
}
