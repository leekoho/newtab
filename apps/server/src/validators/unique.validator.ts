import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { EntitySchema, FindOptionsWhere, getRepository, ObjectType } from 'typeorm'

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    ((validationArguments: ValidationArguments) => FindOptionsWhere<E>) | keyof E
  ]
}

@ValidatorConstraint({ async: true })
export abstract class UniqueConstraint implements ValidatorConstraintInterface {
  protected constructor() {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [EntityClass, findCondition = args.property] = args.constraints
    return (
      (await getRepository(EntityClass).count({
        // @ts-ignore
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      })) <= 0
    )
  }

  public defaultMessage(args: ValidationArguments) {
    console.log(args)
    const [EntityClass] = args.constraints
    const entity = EntityClass.name || 'Entity'
    return `${entity} with the same '${args.property}' already exist`
  }
}

export function Unique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueConstraint,
    })
  }
}
