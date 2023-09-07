import { IResponse } from '@/response/response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { CHANGE_AVATAR_ROUTE } from '@/constant/user.constant';
import { UnsupportedMediaType } from '@/errors/unsupportedMediaType.error';

export class ChangeAvatarResponse implements IResponse<UserResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: CHANGE_AVATAR_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'User after update',
  })
  data: UserResponse;
}

export class ChangeAvatarError_UserNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CHANGE_AVATAR_ROUTE.USER_NOT_FOUND,
  })
  message: string;
}

export class ChangeAvatarError_UnsupportedMediaType extends UnsupportedMediaType<string> {
  @ApiProperty({
    description: 'Message',
    example: CHANGE_AVATAR_ROUTE.WRONG_IMAGE_TYPE,
  })
  message: string;
}
