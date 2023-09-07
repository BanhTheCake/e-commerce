import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'Active token', async: true })
@Injectable()
export class ActiveTokenValidator implements ValidatorConstraintInterface {
  constructor(private userServices: UsersService) {}
  async validate(value: any): Promise<boolean> {
    try {
      const [userId, activeToken] = value.split('.');
      if (!userId || !activeToken) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not valid`;
  }
}

export function ActiveToken(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ActiveTokenValidator,
    });
  };
}
