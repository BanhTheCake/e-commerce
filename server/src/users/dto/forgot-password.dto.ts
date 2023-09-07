import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email account',
    example: 'binhanh054@gmail.com',
  })
  email: string;
}
