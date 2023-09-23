import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CartItemResponse } from './add-response.dto';
import { ProductResponse } from '@/products/dto/product.response';
import { GET_CART_ITEM_ROUTE } from '@/constant/cart.constant';
import { IResponse } from '@/response/response';

class CartItemWithProduct extends CartItemResponse {
  @Expose()
  @Type(() => ProductResponse)
  @ApiProperty({
    description: 'Product',
    type: PickType(ProductResponse, [
      'id',
      'created_at',
      'updated_at',
      'label',
      'slug',
      'price',
      'quantity',
      'star',
    ]),
  })
  product: Pick<
    ProductResponse,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'label'
    | 'slug'
    | 'price'
    | 'quantity'
    | 'star'
  >;
}

export class CartResponse {
  @Expose()
  @ApiProperty({
    description: 'Id of cart',
    example: 'd9f074c1-4768-4ac1-a80d-03ad396882a2',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Created at',
    example: '2020-12-12T12:12:12',
  })
  created_at: string;

  @Expose()
  @ApiProperty({
    description: 'Updated at',
    example: '2020-12-12T12:12:12',
  })
  updated_at: string;

  @Expose()
  @ApiProperty({
    description: 'User id',
    example: 'd9f074c1-4768-4ac1-a80d-03ad396882a2',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Total (not implement yet - default 0)',
    example: 10000,
  })
  total: number;

  @Expose()
  @Type(() => CartItemWithProduct)
  @ApiProperty({
    description: 'List of cart items',
    type: CartItemWithProduct,
    isArray: true,
  })
  cartItems: CartItemWithProduct[];
}

export class GetCartItemsResponse implements IResponse<CartResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: GET_CART_ITEM_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: CartResponse,
  })
  data: CartResponse;
}
