import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllCategoriesDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({
    description: 'Search query',
    example: 'Đồ Chơi',
    required: false,
  })
  q?: string;
}
