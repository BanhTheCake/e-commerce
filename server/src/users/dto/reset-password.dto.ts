import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty({
    description: 'Token for reset password',
    example: '19dd8e88d0d827c028061230eaa9adb17fcbbf91b859ba0e0339affafa347e3f',
  })
  token: string;

  @IsUUID()
  @ApiProperty({
    description: 'User id',
    example: '7a32ce64-eb9b-4b83-8f97-453987c421b5',
  })
  userId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'New password',
    example: '12345',
  })
  password: string;
}
