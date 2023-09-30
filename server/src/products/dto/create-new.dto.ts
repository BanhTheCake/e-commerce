import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductDetail {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Key of product details',
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

export class Image {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Url of image',
    example:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  })
  url: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Public id of images',
    example: 'ecommerce/cjs9a2fw8wlhztacaf2g',
  })
  publicId: string;
}

export class CreateNewDto {
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  @ApiProperty({
    description: 'Label product',
    example: 'iPhone 13 Pro Max',
  })
  label: string;

  @IsNumber()
  @Max(120000000)
  @Min(1000)
  @ApiProperty({
    description: 'Price product',
    example: 1000000,
  })
  price: number;

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

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'ids of Category',
    example: ['d2eba309-1e61-45b6-ad23-865d87ad3933'],
    isArray: true,
  })
  categories: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductDetail)
  @ApiProperty({
    description: 'details of product',
    type: ProductDetail,
    isArray: true,
  })
  details: ProductDetail[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Image)
  @ApiProperty({
    description: 'Image of product',
    type: Image,
    isArray: true,
  })
  images: Image[];
}
