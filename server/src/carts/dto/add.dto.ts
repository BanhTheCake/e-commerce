import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Product id',
    example: 'fe660c83-909b-420a-924a-469865bcdbf3',
  })
  productId: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Quantity',
    example: 5,
  })
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Cart id of user',
    example: 'd9f074c1-4768-4ac1-a80d-03ad396882a2',
  })
  cartId: string;
}
