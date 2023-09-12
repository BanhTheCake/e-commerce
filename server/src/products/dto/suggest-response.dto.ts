import { SUGGEST_ROUTE } from '@/constant/product.constant';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

class Suggest {
  @ApiProperty({
    description: 'Id',
    example: '34dd9bc1-a581-4942-98f0-fc3255b19b4f',
  })
  id: string;

  @ApiProperty({
    description: 'Query suggest',
    example: 'Iphone 14 pro-max',
  })
  query: string;
}

export class SuggestResponse implements IResponse<Suggest> {
  @ApiProperty({
    description: 'Message',
    example: SUGGEST_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Result',
    isArray: true,
  })
  data: Suggest;
}
