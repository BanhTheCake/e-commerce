import { IResponse } from '@/response/response';
import { ProductResponse } from './product.response';
import { ApiProperty } from '@nestjs/swagger';
import { GET_PRODUCT_ROUTE } from '@/constant/product.constant';

export class GetProductResponse implements IResponse<ProductResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: GET_PRODUCT_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'New product',
  })
  data: ProductResponse;
}
