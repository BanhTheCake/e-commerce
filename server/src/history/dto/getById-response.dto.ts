import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProductResponse } from '@/products/dto/product.response';
import { IResponse } from '@/response/response';
import { GET_BY_ID_HISTORY_ROUTE } from '@/constant/history.constant';
import { BadRequestError } from '@/errors/bad-request.error';

export class productHistoriesResponse {
  @Expose()
  @ApiProperty({
    description: 'Id of history item',
    example: 'a73432d1-be05-4210-97b6-fe0bbe8c0e61',
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
    description: 'History id',
    example: 'a73432d1-be05-4210-97b6-fe0bbe8c0e61',
  })
  historyId: string;

  @Expose()
  @ApiProperty({
    description: 'product id',
    example: 'fe660c83-909b-420a-924a-469865bcdbf3',
  })
  productId: string;

  @Expose()
  @ApiProperty({
    description: 'Quantity',
    example: 2,
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'price',
    example: 10000,
  })
  price: number;

  @Expose()
  @Type(() => ProductResponse)
  @ApiProperty({
    description: 'Product',
    type: OmitType(ProductResponse, ['categories', 'images']),
  })
  product: ProductResponse;
}

export class HistoryResponse {
  @Expose()
  @ApiProperty({
    description: 'Id of history',
    example: 'a73432d1-be05-4210-97b6-fe0bbe8c0e61',
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
    example: '0d27512f-d499-47c4-83af-4f9a7e932e9b',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Total',
    example: 79800,
  })
  total: number;

  @Expose()
  @Type(() => productHistoriesResponse)
  @ApiProperty({
    description: 'History items',
    type: productHistoriesResponse,
    isArray: true,
  })
  productHistories: productHistoriesResponse[];
}

export class GetHistoryByIdResponse implements IResponse<HistoryResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: GET_BY_ID_HISTORY_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: HistoryResponse,
  })
  data: HistoryResponse;
}

export class GetHistoryByIdError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'message',
    example: GET_BY_ID_HISTORY_ROUTE.NOT_FOUND,
  })
  message: string;
}
