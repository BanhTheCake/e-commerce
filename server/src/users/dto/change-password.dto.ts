import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Your old password',
    example: '123456',
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Your new password',
    example: '12345',
  })
  newPassword: string;
}
