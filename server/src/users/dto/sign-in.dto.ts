import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Username or email',
    example: 'binhanh054@gmail.com',
  })
  usernameOrEmail: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;
}
