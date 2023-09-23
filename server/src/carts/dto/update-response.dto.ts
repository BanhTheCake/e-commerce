import { UPDATE_CART_ROUTE } from '@/constant/cart.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: UPDATE_CART_ROUTE.SUCCESS,
  })
  message: string;
}

const id = 'fe660c83-909b-420a-924a-469865bcdbf3';

export class UpdateCartError_ProductNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Product not found',
    example: UPDATE_CART_ROUTE.PRODUCT_NOT_FOUND(id),
  })
  message: string;
}

export class UpdateCartError_OutOfStock extends BadRequestError<string> {
  @ApiProperty({
    description: 'Out of stock',
    example: UPDATE_CART_ROUTE.OUT_OF_STOCK(id),
  })
  message: string;
}
