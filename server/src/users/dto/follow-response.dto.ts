import { FOLLOW_ROUTE } from '@/constant/user.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { ICursor } from '@/response/pagination';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class FollowResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: FOLLOW_ROUTE.SUCCESS('(Follow | Unfollow)'),
  })
  message: string;
}

export class GetFollowResponse implements ICursor<UserResponse[]> {
  @ApiProperty({
    description: 'Limit',
    example: 4,
  })
  limit: number;

  @ApiProperty({
    description: 'Total',
    example: '10',
  })
  total: number;

  @ApiProperty({
    description: 'Next cursor (milliseconds)',
    example: '1694861337238',
  })
  next: number;

  @ApiProperty({
    description: 'Data',
    type: UserResponse,
    isArray: true,
  })
  data: UserResponse[];
}

export class FollowError_Yourself extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: FOLLOW_ROUTE.YOURSELF,
  })
  message: string;
}

export class FollowError_UserNotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: FOLLOW_ROUTE.USER_NOT_FOUND,
  })
  message: string;
}

export class FollowError_AlreadyFollow extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: FOLLOW_ROUTE.ALREADY_FOLLOW,
  })
  message: string;
}
