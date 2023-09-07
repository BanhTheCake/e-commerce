import { IResponse } from '@/response/response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { SIGN_IN_ROUTE } from '@/constant/user.constant';

export class SignInResponse implements IResponse<UserResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: SIGN_IN_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: UserResponse;
}

export class SignInResponseError_incorrect extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: SIGN_IN_ROUTE.INCORRECT,
  })
  message: string;
}
