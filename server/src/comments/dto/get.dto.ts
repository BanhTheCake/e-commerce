import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class GetQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    description: 'Limit',
    example: 4,
    required: false,
    default: 4,
  })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    description: 'Reply comment limit',
    example: 2,
    required: false,
    default: 2,
  })
  limitReply?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty({
    description: 'Page',
    example: 1,
    required: false,
    default: 1,
  })
  page?: number;
}

export class GetParamDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Product id',
    example: '9a1c7bdb-6eb5-42af-822c-3b06ec685135',
  })
  productId: string;
}
