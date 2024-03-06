import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUsername', async: false })
export class UsernameValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return !value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
  }

  defaultMessage(): string {
    return 'Username is not valid';
  }
}
