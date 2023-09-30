import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedError {
  @ApiProperty({
    description: 'Status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Code',
    example: 'UnauthorizedException',
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;
}
