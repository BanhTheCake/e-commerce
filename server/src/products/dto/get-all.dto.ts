import { Products } from '@/entities';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotContains,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

type SORT_BY = keyof Products;
const ARRAY_SORT_BY: SORT_BY[] = [
  'label',
  'created_at',
  'price',
  'quantity',
  'star',
];

export class GetAllQueryDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Limit',
    example: 6,
  })
  limit: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'page',
    example: 1,
  })
  page: number;

  @Transform(({ value }) => (value as string).toUpperCase())
  @IsString()
  @IsEnum(ORDER)
  @IsOptional()
  @ApiProperty({
    description: 'Order',
    example: ORDER.ASC,
    type: ORDER,
    required: false,
  })
  order?: ORDER;

  @IsString()
  @MinLength(3)
  @IsIn(ARRAY_SORT_BY)
  @IsOptional()
  @ApiProperty({
    description: 'Sort by',
    example: 'label',
    required: false,
    type: 'string',
  })
  sortBy?: SORT_BY;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty({
    description: 'Value will be use when sortBy = star',
    example: 4,
    required: false,
  })
  value?: number;

  // Slug
  @IsString()
  @NotContains(' ', { message: 'Category slug cannot contain spaces' })
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({
    description: 'Category slug',
    example: 'suc-khoe',
    required: false,
  })
  category?: string;
}
