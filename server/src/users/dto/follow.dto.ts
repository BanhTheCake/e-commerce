import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export enum FollowType {
  FOLLOW = 'follow',
  UN_FOLLOW = 'unfollow',
}

export enum FollowStatus {
  FOLLOWER = 'follower',
  FOLLOWING = 'following',
}

export class FollowDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'user id you want to follow',
    example: '5bac929c-8f3a-4af9-bfd8-33989fe289ec',
  })
  followingId: string;

  @IsString()
  @IsEnum(FollowType)
  @ApiProperty({
    description: 'type of follow',
    example: FollowType.FOLLOW,
    enum: FollowType,
  })
  type: FollowType;
}

export class FollowQueryDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    description: 'Limit',
    example: 4,
  })
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiProperty({
    description: 'Cursor (milliseconds)',
    example: '1694861337238',
    nullable: true,
    required: false,
  })
  cursor?: number;

  @IsOptional()
  @IsEnum(FollowStatus)
  @ApiProperty({
    description: 'Type of follow',
    example: FollowStatus.FOLLOWER,
    enum: FollowStatus,
  })
  type: FollowStatus;
}
