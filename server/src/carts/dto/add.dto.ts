import { IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export class AddToDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
