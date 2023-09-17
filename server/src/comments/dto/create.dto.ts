import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CommentType {
  CREATE = 'create',
  REPLY = 'reply',
}

export class CreateDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Content',
    example: 'Comment 1',
  })
  content: string;

  @ValidateIf((o) => o.type !== CommentType.REPLY)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Star (Will validate if type === create)',
    example: 5,
    required: false,
  })
  starValue?: number;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Product id',
    example: '12345678-1234-1234-1234-123456789012',
  })
  productId: string;

  @ValidateIf((o) => o.type === CommentType.REPLY)
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Reply id (Will validate if type === reply)',
    example: '12345678-1234-1234-1234-123456789012',
    required: false,
  })
  replyId?: string;

  @IsOptional()
  @IsString()
  @IsEnum(CommentType)
  @ApiProperty({
    description: 'Type (default is create)',
    example: 'create',
    enum: CommentType,
    required: false,
  })
  type?: CommentType;
}
