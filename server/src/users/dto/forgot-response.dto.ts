import { FORGOT_ROUTE } from '@/constant/user.constant';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: FORGOT_ROUTE.SUCCESS,
  })
  message: string;
}
