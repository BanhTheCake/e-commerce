import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "Cart's id",
    example: 'd9f074c1-4768-4ac1-a80d-03ad396882a2',
  })
  cartId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "Product's id",
    example: 'fe660c83-909b-420a-924a-469865bcdbf3',
  })
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Quantity',
    example: 1,
  })
  quantity: number;
}
