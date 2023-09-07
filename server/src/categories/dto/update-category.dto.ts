import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'New Category Label',
    example: 'Đồ Chơi',
  })
  label: string;
}

export class UpdateCategoryParamsDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id Category to update',
    example: '423392cf-e9e3-4869-bb88-fdfd21670167',
  })
  id: string;
}
