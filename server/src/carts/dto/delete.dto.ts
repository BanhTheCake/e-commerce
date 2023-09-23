import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'List of cart items id want to delete',
    example: ['c24a0640-965d-4452-bbd1-9b84819892f6'],
    isArray: true,
  })
  cartItems: string[];

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "Cart's id",
    example: 'c24a0640-965d-4452-bbd1-9b84819892f6',
  })
  cartId: string;
}
