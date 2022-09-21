import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTodoDto {
  @IsString({ message: '代办事项名称必须为字符串' })
  @IsNotEmpty({ message: '代办事项名称不能为空' })
  readonly name: string
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: '代办事项名称必须为字符串' })
  readonly name?: string

  @IsOptional()
  @IsBoolean({ message: 'completed必须为布尔值' })
  readonly completed?: boolean
}
