import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class GetRelativesDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Limit',
    example: 6,
  })
  limit: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'page',
    example: 1,
  })
  page: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'User id',
    example: '',
    required: false,
  })
  userId?: string;
}
