import { ApiProperty } from '@nestjs/swagger';

export abstract class BadRequestError<T> {
  @ApiProperty({
    description: 'Status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Code',
    example: 'BadRequestException',
  })
  code: string;

  abstract message: T;
}
