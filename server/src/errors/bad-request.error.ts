import { ApiProperty } from '@nestjs/swagger';

export abstract class BadRequestError<T> {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  StatusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
  })
  error: string;

  abstract message: T;
}
