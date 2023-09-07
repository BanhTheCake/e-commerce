import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'binhanh054@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Username',
    example: 'banhTheCake',
  })
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;
}
