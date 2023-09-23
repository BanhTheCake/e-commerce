import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IResponse } from '@/response/response';
import { HistoryResponse } from './getById-response.dto';
import { GET_ALL_HISTORY_ROUTE } from '@/constant/history.constant';

class HistoryWithoutProductResponse extends OmitType(HistoryResponse, [
  'productHistories',
]) {}

export class GetAllHistoriesResponse
  implements IResponse<Omit<HistoryResponse, 'productHistories'>[]>
{
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: GET_ALL_HISTORY_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: HistoryWithoutProductResponse,
    isArray: true,
  })
  data: Omit<HistoryResponse, 'productHistories'>[];
}
