import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeleteParamDto {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Comment id',
    example: '5e7b0a3e-6a2f-4f1f-8b5d-0e6e7e8f9f9f',
  })
  id: string;
}
