import { HttpException, HttpStatus, ValidationError as _ValidationError } from '@nestjs/common'
import { HTTP_EXCEPTION_TEXT } from '@/constants/text.constant'

export interface IValidationError {
  [key: string]: string[]
}

export class ValidationError extends HttpException {
  constructor(errors?: _ValidationError[]) {
    const _errors: IValidationError = {}
    errors.forEach(error => {
      _errors[error.property] = Object.values(error.constraints)
    })
    super(
      {
        message: HTTP_EXCEPTION_TEXT.VALIDATION_FAIL,
        errors: _errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
