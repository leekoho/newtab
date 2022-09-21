/**
 * Validation pipe.
 * @file 数据表验证器
 * @module pipe/validation
 */
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { ValidationError } from '@/errors/validation.error'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
    return value
  }

  private static toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
