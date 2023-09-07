import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of product',
    example: 'd2eba309-1e61-45b6-ad23-865d87ad3933',
  })
  id: string;
}
