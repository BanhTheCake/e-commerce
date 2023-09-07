import { IResponse } from '@/response/response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { INFO_ROUTE } from '@/constant/user.constant';

export class InfoResponse implements IResponse<UserResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: INFO_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data user after update',
  })
  data: UserResponse;
}

export class InfoError_UserNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: INFO_ROUTE.USER_NOT_FOUND,
  })
  message: string;
}
