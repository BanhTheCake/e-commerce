import { ApiProperty } from '@nestjs/swagger';

export class InternalServerError {
  @ApiProperty({
    description: 'Status code',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Something wrong with server!',
  })
  message: string;

  @ApiProperty({
    description: 'Code',
    example: 'InternalServerErrorException',
  })
  code: string;
}
