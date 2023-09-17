import { CategoryResponse } from '@/categories/dto/category.response';
import { ImagesResponse } from '@/images/dto/image.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProductResponse {
  @ApiProperty({
    description: 'Id of product',
    example: 'd2eba309-1e61-45b6-ad23-865d87ad3933',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of product',
    example: 'Áo quần đen',
  })
  @Expose()
  label: string;

  @ApiProperty({
    description: 'Slug of product',
    example: 'ao-quan-den',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Price of product',
    example: 50000,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Quantity of product',
    example: 10,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'Owner of product',
    example: 'd2eba309-1e61-45b6-ad23-865d87ad3933',
  })
  @Expose()
  ownerId: string;

  @ApiProperty({
    description: 'Star of product',
    example: 5,
  })
  @Expose()
  star: number;

  @ApiProperty({
    description: 'count of comments',
    example: 5,
  })
  @Expose()
  count: number;

  @ApiProperty({
    description: 'Description of product',
    example: 'Đây là mô tả',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Categories of product',
    type: () => [CategoryResponse],
  })
  @Expose()
  @Type(() => CategoryResponse)
  categories: CategoryResponse[];

  @ApiProperty({
    description: 'Images of product',
    type: () => [ImagesResponse],
  })
  @Expose()
  @Type(() => ImagesResponse)
  images: ImagesResponse[];
  @ApiProperty({
    description: 'Created at',
    example: '2023-09-03T22:20:02.569Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2023-09-03T22:20:02.569Z',
  })
  @Expose()
  updated_at: Date;
}
