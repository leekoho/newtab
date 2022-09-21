import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator'
import { UniqueConstraint } from '@/validators/unique.validator'
import { UserEntity } from '@/modules/user/user.entity'
import { GenderEnum } from '@/enums'

export class PasswordDto {
  @IsString({ message: '密码必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 24, { message: '密码长度需在$constraint1 ~ $constraint2之间' })
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
  //   message: '密码必须至少含有一个字母和一个数字',
  // })
  password: string
}

export class CreateUserDto extends PasswordDto {
  @IsString({ message: '用户名必须为字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Validate(UniqueConstraint, [UserEntity], { message: '用户名「$value」已存在' })
  username: string

  nickname: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '$value 不是合法的邮箱地址' })
  @Validate(UniqueConstraint, [UserEntity], { message: '邮箱「$value」已存在' })
  email: string

  @IsOptional()
  @IsEnum({ enum: GenderEnum })
  gender?: string
}
