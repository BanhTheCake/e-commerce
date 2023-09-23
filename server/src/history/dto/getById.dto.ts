import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetParamDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The id of the history',
    example: 'a73432d1-be05-4210-97b6-fe0bbe8c0e61',
  })
  id: string;
}
