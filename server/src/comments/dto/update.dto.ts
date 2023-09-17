import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateParamDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Comment id',
    example: '2d3e3e4e-4e4e-4e4e-4e4e-4e4e4e4e4e4',
  })
  id: string;
}

export class UpdateDto {
  @ValidateIf((o) => o.starValue || o.content === undefined)
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description:
      'Star value (Will validate if starValue !== undefine or content === undefined)',
    example: 5,
    required: false,
  })
  starValue?: number;

  @ValidateIf((o) => o.content || o.starValue === undefined)
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description:
      'Content (Will validate if content !== undefine or starValue === undefined)',
    example: 'Comment 1 edit',
    required: false,
  })
  content?: string;
}
