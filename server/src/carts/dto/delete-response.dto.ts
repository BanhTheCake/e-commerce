import { DELETE_CART_ITEM_ROUTE } from '@/constant/cart.constant';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCartResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: DELETE_CART_ITEM_ROUTE.SUCCESS,
  })
  message: string;
}
