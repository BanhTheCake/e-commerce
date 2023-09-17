import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetReplyParamDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Comment id',
    example: '0b0c0e0f-0d1e-4f5b-9b9c-9e0f1d1e4f5b',
  })
  commentId: string;
}

export class GetReplyQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    description: 'Limit',
    example: 4,
    default: 4,
    required: false,
  })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiProperty({
    description: 'Cursor (milliseconds)',
    example: 1694752395847,
    required: false,
  })
  cursor?: number;
}
