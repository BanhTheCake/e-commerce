import { IResponse } from '@/response/response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { SIGN_UP_ROUTE } from '@/constant/user.constant';

export class SignUpResponse implements IResponse<UserResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: SIGN_UP_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: UserResponse;
}

export class SignupResponseError_notActive extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: SIGN_UP_ROUTE.ACTIVE_ACCOUNT,
  })
  message: string;
}

export class SignupResponseError_EmailExist extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: SIGN_UP_ROUTE.EMAIL_EXIST,
  })
  message: string;
}

export class SignupResponseError_UsernameExist extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: SIGN_UP_ROUTE.USERNAME_EXIST,
  })
  message: string;
}
