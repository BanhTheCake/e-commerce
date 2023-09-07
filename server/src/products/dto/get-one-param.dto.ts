import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GetOneParamDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of product',
    example: 'd2eba309-1e61-45b6-ad23-865d87ad3933',
  })
  id: string;
}
