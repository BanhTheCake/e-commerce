import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentResponse {
  @ApiProperty({
    description: 'Comment id',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Content',
    example: 'Comment 1',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Star',
    example: 5,
    nullable: true,
  })
  @Expose()
  starValue: number;

  @ApiProperty({
    description: 'User id',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Product id',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @Expose()
  productId: string;

  @ApiProperty({
    description: 'Reply id',
    example: '12345678-1234-1234-1234-123456789012',
    nullable: true,
  })
  @Expose()
  replyId: string;

  @ApiProperty({
    description: 'Created at',
    example: '2022-10-10 10:10:10',
  })
  @Expose()
  created_at: string;

  @ApiProperty({
    description: 'Updated at',
    example: '2022-10-10 10:10:10',
  })
  @Expose()
  updated_at: string;
}
