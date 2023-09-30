import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TransformJson } from '@/decorators/transform-json.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const UpdateTypeArr = ['ADD', 'DEL', 'MODIFY'] as const;
export type UpdateType = (typeof UpdateTypeArr)[number];
export class UpdateParamDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of product',
    example: '66d695ce-2561-4e07-a992-7e65658a64d3',
  })
  id: string;
}

export class ProductDetails {
  @ValidateIf((o) => o.type === 'DEL' || o.type === 'MODIFY')
  @IsUUID()
  @ApiProperty({
    description: 'Id of details (required if type is MODIFY or DEL)',
    example: '66d695ce-2561-4e07-a992-7e65658a64d3',
    required: false,
  })
  id?: string;

  @IsIn(UpdateTypeArr)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type (DEL or MODIFY or ADD)',
    example: 'DEL',
  })
  type: UpdateType;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'name of product details',
    example: 'Loại bảo hành',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Value of product details',
    example: '256GB',
  })
  value: string;
}

export class ImageBody {
  @ValidateIf((o) => o.type === 'DEL')
  @IsUUID()
  @ApiProperty({
    description: 'Id of details (required if type is DEL)',
    example: '66d695ce-2561-4e07-a992-7e65658a64d3',
    required: false,
  })
  id?: string;

  @IsIn(UpdateTypeArr)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type (DEL or MODIFY or ADD)',
    example: 'DEL',
  })
  type: UpdateType;

  @IsUrl()
  @ApiProperty({
    description: 'Url of product',
    example:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  })
  url: string;

  @IsString()
  @ApiProperty({
    description: 'Public id of images',
    example: 'ecommerce/cjs9a2fw8wlhztacaf2g',
  })
  publicId: string;
}

export class Category {
  @IsUUID()
  @ApiProperty({
    description: 'Id of category',
    example: '66d695ce-2561-4e07-a992-7e65658a64d3',
  })
  id: string;

  @IsIn(UpdateTypeArr)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Type (DEL or ADD)',
    example: 'DEL',
  })
  type: UpdateType;
}

export class UpdateBodyDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Category)
  @ApiProperty({
    description: 'List id of categories',
    type: Category,
    isArray: true,
    required: false,
  })
  categories?: Category[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductDetails)
  @ApiProperty({
    description: 'details of product',
    type: ProductDetails,
    isArray: true,
    required: false,
  })
  details?: ProductDetails[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ImageBody)
  @ApiProperty({
    description: 'images of product',
    type: ImageBody,
    isArray: true,
    required: false,
  })
  images?: ImageBody[];

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
}
