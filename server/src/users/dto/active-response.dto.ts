import { ACTIVE_ROUTE } from '@/constant/user.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class ActiveResponseDto implements IResponse<never> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: ACTIVE_ROUTE.SUCCESS,
  })
  message: string;
}

export class ActiveResponseError_wrongFormat extends BadRequestError<string[]> {
  @ApiProperty({
    description: 'Status code',
    example: [ACTIVE_ROUTE.TOKEN_WRONG],
  })
  message;
}

export class ActiveResponseError_invalidToken extends BadRequestError<string> {
  @ApiProperty({
    description: 'Status code',
    example: ACTIVE_ROUTE.TOKEN_INVALID,
  })
  message;
}

export class ActiveResponseError_hasActive extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: ACTIVE_ROUTE.ACCOUNT_HAS_ALREADY_ACTIVATED,
  })
  message;
}
