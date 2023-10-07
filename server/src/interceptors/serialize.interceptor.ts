import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface IData {
  [key: string]: any;
  data: any;
}

const isIData = (obj: any): obj is IData => {
  return obj && 'data' in obj;
};

type classInstance = new (...args: any) => any;

export function Serialize(dto: classInstance) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: classInstance) {}
  intercept(content: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (isIData(value)) {
          return {
            ...value,
            data:
              plainToInstance(this.dto, value.data, {
                excludeExtraneousValues: true,
              }) || null,
          };
        }
        return plainToInstance(this.dto, value, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
