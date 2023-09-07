import { REFRESH_NEW_TOKEN_ROUTE } from '@/constant/user.constant';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshNewTokenResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: REFRESH_NEW_TOKEN_ROUTE.SUCCESS,
  })
  message: string;
}
