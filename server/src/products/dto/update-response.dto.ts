import {
  DELETE_PRODUCT_ROUTE,
  UPDATE_PRODUCT_ROUTE,
} from '@/constant/product.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: UPDATE_PRODUCT_ROUTE.SUCCESS(
      '66d695ce-2561-4e07-a992-7e65658a64d3',
    ),
  })
  message: string;
}

export class UpdateProductError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: UPDATE_PRODUCT_ROUTE.NOT_FOUND,
  })
  message: string;
}

export class UpdateProductError_Nothing extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: UPDATE_PRODUCT_ROUTE.NOTHING,
  })
  message: string;
}
