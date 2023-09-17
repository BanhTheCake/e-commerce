import { Expose, Type } from 'class-transformer';
import { CommentResponse } from './comment.response';
import { ICursor, IPagination } from '@/response/pagination';
import { ApiProperty } from '@nestjs/swagger';

class RepliesResponse implements ICursor<CommentResponse[]> {
  @ApiProperty({
    description: 'Limit',
    example: 5,
  })
  @Expose()
  limit: number;

  @ApiProperty({
    description: 'next cursor (milliseconds)',
    example: 1694752395847,
    nullable: true,
  })
  @Expose()
  next: number;

  @ApiProperty({
    description: 'Total',
    example: 10,
  })
  @Expose()
  total: number;

  @ApiProperty({
    description: 'Comment id',
    example: '9a1c7bdb-6eb5-42af-822c-3b06ec685135',
  })
  @Expose()
  commentId: string;

  @ApiProperty({
    description: 'Data',
    type: CommentResponse,
    isArray: true,
  })
  @Expose()
  @Type(() => CommentResponse)
  data: CommentResponse[];
}

export class GetAllCommentsData {
  @ApiProperty({
    description: 'Comment',
    type: CommentResponse,
  })
  @Expose()
  @Type(() => CommentResponse)
  comment: CommentResponse;

  @ApiProperty({
    description: 'replies',
    type: RepliesResponse,
  })
  @Expose()
  @Type(() => RepliesResponse)
  replies: RepliesResponse;
}

export class GetAllResponse implements IPagination<GetAllCommentsData> {
  @ApiProperty({
    description: 'Limit',
    example: 5,
  })
  limit: number;

  @ApiProperty({
    description: 'page',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'pages',
    example: 5,
  })
  pages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Has prev page',
    example: false,
  })
  hasPrevPage: boolean;

  @ApiProperty({
    description: 'Total of products',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Data',
    type: GetAllCommentsData,
    isArray: true,
  })
  data: GetAllCommentsData;
}
