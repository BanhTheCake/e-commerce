import { IPagination } from '@/response/pagination';
import { ProductResponse } from './product.response';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsResponse implements IPagination<ProductResponse> {
  @ApiProperty({
    description: 'Limit',
    example: 5,
  })
  limit: number;

  @ApiProperty({
    description: 'page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'pages',
    example: 5,
  })
  pages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Has prev page',
    example: false,
  })
  hasPrevPage: boolean;

  @ApiProperty({
    description: 'Total of products',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Data',
    isArray: true,
    type: ProductResponse,
  })
  data: ProductResponse;
}
