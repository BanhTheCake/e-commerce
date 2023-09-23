import { IResponse } from '@/response/response';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ADD_TO_CART_ROUTE } from '@/constant/cart.constant';
import { BadRequestError } from '@/errors/bad-request.error';

export class CartItemResponse {
  @Expose()
  @ApiProperty({
    description: 'Id of cart item',
    example: 'c24a0640-965d-4452-bbd1-9b84819892f6',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Create at',
    example: '2022-03-01T00:00:00.000Z',
  })
  created_at: string;

  @Expose()
  @ApiProperty({
    description: 'Update at',
    example: '2022-03-01T00:00:00.000Z',
  })
  updated_at: string;

  @Expose()
  @ApiProperty({
    description: "Cart's id",
    example: 'c24a0640-965d-4452-bbd1-9b84819892f6',
  })
  cartId: string;

  @Expose()
  @ApiProperty({
    description: "Product's id",
    example: 'fe660c83-909b-420a-924a-469865bcdbf3',
  })
  productId: string;

  @Expose()
  @ApiProperty({
    description: 'Quantity',
    example: 1,
  })
  quantity: number;
}

export class AddToCartResponse implements IResponse<CartItemResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: ADD_TO_CART_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: CartItemResponse,
  })
  data: CartItemResponse;
}

export class AddToCartError_ProductNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: ADD_TO_CART_ROUTE.PRODUCT_NOT_FOUND,
  })
  message: string;
}

export class AddToCartError_OutOfStock extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: ADD_TO_CART_ROUTE.OUT_OF_STOCK,
  })
  message: string;
}
