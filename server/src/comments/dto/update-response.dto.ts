import { IResponse } from '@/response/response';
import { CommentResponse } from './comment.response';
import { ApiProperty } from '@nestjs/swagger';
import { UPDATE_COMMENT_ROUTE } from '@/constant/comment.constant';
import { BadRequestError } from '@/errors/bad-request.error';

export class UpdateCommentResponse implements IResponse<CommentResponse> {
  @ApiProperty({
    description: 'Error code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: UPDATE_COMMENT_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data',
    type: CommentResponse,
  })
  data?: CommentResponse;
}

export class UpdateCommentError_NotFoundProduct extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: UPDATE_COMMENT_ROUTE.NOT_FOUND_PRODUCT,
  })
  message: string;
}

export class UpdateCommentError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: UPDATE_COMMENT_ROUTE.NOT_FOUND,
  })
  message: string;
}
