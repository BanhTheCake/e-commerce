import { ApiProperty } from '@nestjs/swagger';

export class PreloadDto {
  @ApiProperty({
    description: 'File (jpeg, jpg, png)',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;
}
