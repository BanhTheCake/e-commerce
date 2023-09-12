import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(2)
  @ApiProperty({
    description: 'Query want to suggest.',
    example: 'iphone',
  })
  q: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @Max(20)
  @IsOptional()
  @ApiProperty({
    description: 'Limit result return.',
    example: 10,
    required: false,
  })
  limit?: number;
}
