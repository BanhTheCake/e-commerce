import {
  ArrayMinSize,
  IsArray,
  IsNumber,
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

export class CreateNewDto {
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  @ApiProperty({
    description: 'Label product',
    example: 'iPhone 13 Pro Max',
  })
  label: string;

  @TransformJson()
  @IsNumber()
  @Max(120000000)
  @Min(1000)
  @ApiProperty({
    description: 'Price product',
    example: 1000000,
  })
  price: number;

  @TransformJson()
  @IsNumber()
  @IsPositive()
  @Max(10000)
  @ApiProperty({
    description: 'Quantity product',
    example: 1,
  })
  quantity: number;

  @IsString()
  @MinLength(10)
  @ApiProperty({
    description: 'Description product',
    example: 'iPhone 13 Pro Max',
  })
  description: string;

  @TransformJson()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'ids of Category type JSON',
    example: ['d2eba309-1e61-45b6-ad23-865d87ad3933'],
    type: 'json',
  })
  categories: string[];

  @ApiProperty({
    description: 'Files description product (jpeg, jpg, png) (Max: 5MB)',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  files: Array<Express.Multer.File>;
}
