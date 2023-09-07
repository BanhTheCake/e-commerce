import { ApiProperty } from '@nestjs/swagger';

export abstract class UnsupportedMediaType<T> {
  @ApiProperty({
    description: 'Status code',
    example: 415,
  })
  StatusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unsupported Media Type',
  })
  error: string;

  abstract message: T;
}
