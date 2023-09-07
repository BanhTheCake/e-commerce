import { ApiProperty } from '@nestjs/swagger';

export interface IResponse<T> {
  errCode: number;
  message: string;
  data?: T;
}
