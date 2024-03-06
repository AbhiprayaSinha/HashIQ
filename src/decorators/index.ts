import { registerDecorator, ValidationOptions } from 'class-validator';
import { UsernameValidator } from '../validators';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: UsernameValidator,
    });
  };
}
