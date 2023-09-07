import { ApiProperty } from '@nestjs/swagger';
import { IResponse } from '@/response/response';
import { SIGN_OUT_ROUTE } from '@/constant/user.constant';

export class SignOutResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: SIGN_OUT_ROUTE.SUCCESS,
  })
  message: string;
}
