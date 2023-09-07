import { ApiProperty } from '@nestjs/swagger';

export class InternalServerError {
  @ApiProperty({
    description: 'Status code',
    example: 500,
  })
  StatusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Internal Server Error',
  })
  error: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Something wrong with server!',
  })
  message: string;
}
