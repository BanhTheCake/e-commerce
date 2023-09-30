import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvatarDto {
  @IsUrl()
  @ApiProperty({
    description: 'Url of image',
    example:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  })
  url: string;

  @IsString()
  @ApiProperty({
    description: 'Public id of images',
    example: 'ecommerce/cjs9a2fw8wlhztacaf2g',
  })
  publicId: string;
}
