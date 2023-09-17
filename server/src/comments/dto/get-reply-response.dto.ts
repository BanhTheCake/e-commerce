import { ICursor } from '@/response/pagination';
import { CommentResponse } from './comment.response';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestError } from '@/errors/bad-request.error';
import { GET_REPLY_ROUTE } from '@/constant/comment.constant';

export class GetReplyResponse implements ICursor<CommentResponse[]> {
  @ApiProperty({
    description: 'Limit',
    example: 4,
  })
  limit: number;

  @ApiProperty({
    description: 'Next (in milliseconds)',
    example: 1694752395847,
  })
  next: number;

  @ApiProperty({
    description: 'Total reply comment',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Id of comment has reply',
    example: '12345678-1234-1234-1234-123456789012',
  })
  commentId: string;

  @ApiProperty({
    description: 'Data',
    type: CommentResponse,
    isArray: true,
  })
  data: CommentResponse[];
}

export class GetReplyError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: GET_REPLY_ROUTE.NOT_FOUND,
  })
  message: string;
}
