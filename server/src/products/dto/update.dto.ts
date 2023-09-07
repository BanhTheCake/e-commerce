import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TransformJson } from '@/decorators/transform-json.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParamDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of product',
    example: '66d695ce-2561-4e07-a992-7e65658a64d3',
  })
  id: string;
}

export class UpdateBodyDto {
  @TransformJson()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @IsOptional()
  @ApiProperty({
    description: 'List id of images want to delete',
    example: ['66d695ce-2561-4e07-a992-7e65658a64d3'],
    type: 'json',
    required: false,
  })
  filesId?: string[];

  @TransformJson()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  @ApiProperty({
    description: 'List id of categories want to delete',
    example: ['66d695ce-2561-4e07-a992-7e65658a64d3'],
    type: 'json',
    required: false,
  })
  categoriesId?: string[];

  @IsString()
  @MinLength(10)
  @MaxLength(120)
  @IsOptional()
  @ApiProperty({
    description: 'Label product',
    example: 'Iphone 12 promax',
    required: false,
  })
  label?: string;

  @TransformJson()
  @IsNumber()
  @Max(120000000)
  @Min(1000)
  @IsOptional()
  @ApiProperty({
    description: 'Price product',
    example: 100000,
    required: false,
  })
  price?: number;

  @TransformJson()
  @IsNumber()
  @IsPositive()
  @Max(10000)
  @IsOptional()
  @ApiProperty({
    description: 'Quantity product',
    example: 10,
    required: false,
  })
  quantity?: number;

  @IsString()
  @MinLength(10)
  @IsOptional()
  @ApiProperty({
    description: 'Description product',
    example: 'Iphone 12 promax description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Files update',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  files: Array<Express.Multer.File>;
}
