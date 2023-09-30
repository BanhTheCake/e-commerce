import { ApiProperty } from '@nestjs/swagger';

export abstract class UnsupportedMediaType<T> {
  @ApiProperty({
    description: 'Status code',
    example: 415,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Code',
    example: 'UnsupportedMediaTypeException',
  })
  code: string;

  abstract message: T;
}
