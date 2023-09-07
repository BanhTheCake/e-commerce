import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvatarDto {
  @ApiProperty({
    description: 'File avatar (jpeg, jpg, png)',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
