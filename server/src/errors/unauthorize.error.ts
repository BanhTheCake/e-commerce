import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedError {
  @ApiProperty({
    description: 'Status code',
    example: 401,
  })
  StatusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;
}
