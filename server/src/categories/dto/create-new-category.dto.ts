import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewCategoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Label of category',
    example: 'Thời Trang Nam',
  })
  label: string;
}
