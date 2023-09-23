import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentItem {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Product id',
    example: 'c24a0640-965d-4452-bbd1-9b84819892f6',
  })
  productId: string;
}

export class PaymentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "Cart's id",
    example: 'c24a0640-965d-4452-bbd1-9b84819892f6',
  })
  cartId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PaymentItem)
  @ApiProperty({
    description: 'List of cart items',
    isArray: true,
    type: PaymentItem,
  })
  items: PaymentItem[];
}
