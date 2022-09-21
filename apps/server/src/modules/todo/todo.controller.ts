import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { TodoService } from '@/modules/todo/todo.service'
import { TodoEntity } from '@/modules/todo/todo.entity'
import { TodoByIdPipe } from '@/pipes/todo-by-id.pipe'
import { ValidationPipe } from '@/pipes/validation.pipe'
import { CreateTodoDto, UpdateTodoDto } from '@/modules/todo/todo.dto'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * @description 获取所有的代办事项
   */
  @Get('')
  findAll() {
    return this.todoService.findAll()
  }

  /**
   * @description 获取已完成的事项
   */
  @Get('completed')
  findCompleted() {
    return this.todoService.findByCompleted(true)
  }

  /**
   * @description 获取未完成的事项
   */
  @Get('uncompleted')
  @UseGuards(JwtAuthGuard)
  findUncompleted() {
    return this.todoService.findByCompleted(false)
  }

  /**
   * @description 创建代办事项
   * @param createTodoDto
   */
  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto.name)
  }

  /**
   * @description 根据id删除代办事项
   * @param todo
   */
  @Delete(':id')
  delete(@Param('id', TodoByIdPipe) todo: TodoEntity) {
    return this.todoService.remove(todo)
  }

  @Patch(':id')
  updateCompleted(
    @Param('id', TodoByIdPipe) todo: TodoEntity,
    @Body(ValidationPipe) dto: UpdateTodoDto
  ) {
    return this.todoService.update(todo, dto)
  }
}
