import {
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
  NotContains,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InfoDto {
  @ValidateIf((o) => !o.address || o.username)
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @NotContains(' ', {
    message: 'Username cannot contain spaces',
  })
  @ApiProperty({
    description: 'Username',
    example: 'banh',
    required: false,
  })
  username?: string;

  @ValidateIf((o) => !o.username || o.address)
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Address',
    example: '1/2/3 tp Ho Chi Minh',
    required: false,
  })
  address?: string;
}
