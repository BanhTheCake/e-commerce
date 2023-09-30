import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImagesResponse {
  @ApiProperty({
    description: 'Id of images',
    example: '21ca7acc-3276-4178-856a-50f1e85c97fb',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Url',
    example:
      'https://res.cloudinary.com/banhthecake/image/upload/v1693765293/ecommerce/q4hocl4tgzar2gs1sdog.jpg',
  })
  @Expose()
  url: string;

  @ApiProperty({
    description: 'Public to delete image',
    example: 'ecommerce/ssydihevd59bp18gczsg',
  })
  @Expose()
  publicKey: string;

  @ApiProperty({
    description: 'Created at',
    example: '2023-09-03T22:20:02.569Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2023-09-03T22:20:02.569Z',
  })
  @Expose()
  updated_at: Date;
}
