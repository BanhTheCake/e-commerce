import { RESET_PASSWORD_ROUTE } from '@/constant/user.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: RESET_PASSWORD_ROUTE.SUCCESS,
  })
  message: string;
}

export class ResetPasswordError_InvalidToken extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: RESET_PASSWORD_ROUTE.INVALID_TOKEN,
  })
  message: string;
}

export class ResetPasswordError_UserNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: RESET_PASSWORD_ROUTE.USER_NOT_FOUND,
  })
  message: string;
}
