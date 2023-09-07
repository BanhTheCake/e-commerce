import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { CHANGE_PASSWORD_ROUTE } from '@/constant/user.constant';

export class ChangePasswordResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: CHANGE_PASSWORD_ROUTE.SUCCESS,
  })
  message: string;
}

export class ChangePasswordError_UserNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CHANGE_PASSWORD_ROUTE.USER_NOT_FOUND,
  })
  message: string;
}

export class ChangePasswordError_PasswordIncorrect extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CHANGE_PASSWORD_ROUTE.PASSWORD_INCORRECT,
  })
  message: string;
}
