import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryParamsDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of category want to delete',
    example: '00000000-0000-0000-0000-000000000000',
  })
  id: string;
}
