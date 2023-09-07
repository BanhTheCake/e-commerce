import { IResponse } from '@/response/response';
import { ProductResponse } from './product.response';
import { ApiProperty } from '@nestjs/swagger';
import { CREATE_PRODUCT_ROUTE } from '@/constant/product.constant';
import { BadRequestError } from '@/errors/bad-request.error';

export class CreateNewProductResponse implements IResponse<ProductResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: CREATE_PRODUCT_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'New product',
  })
  data: ProductResponse;
}

export class CreateNewProductError_LabelExist extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message error',
    example: CREATE_PRODUCT_ROUTE.EXIST_LABEL,
  })
  message: string;
}
