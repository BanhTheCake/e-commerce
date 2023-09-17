import { IResponse } from '@/response/response';
import { CommentResponse } from './comment.response';
import { ApiProperty } from '@nestjs/swagger';
import { CREATE_COMMENT_ROUTE } from '@/constant/comment.constant';
import { BadRequestError } from '@/errors/bad-request.error';

export class CreateCommentResponse implements IResponse<CommentResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: CREATE_COMMENT_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: CommentResponse,
  })
  data?: CommentResponse;
}

export class CreateCommentError_NotFoundProduct extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CREATE_COMMENT_ROUTE.NOT_FOUND_PRODUCT,
  })
  message: string;
}

export class CreateCommentError_InvalidType extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CREATE_COMMENT_ROUTE.INVALID_TYPE,
  })
  message: string;
}
