import { PRELOAD_ROUTE } from '@/constant/image.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { UnsupportedMediaType } from '@/errors/unsupportedMediaType.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Preload {
  @ApiProperty({
    description: 'Url of image',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/yourimage.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Secure url of image',
    example: 'https://res.cloudinary.com/demo/image/upload/v1/yourimage.jpg',
  })
  secure: string;

  @ApiProperty({
    description: 'Public id of image',
    example: 'ecommerce/b22y9b1kgazvvnrt9rer',
  })
  publicId: string;
}

export class PreloadResponse implements IResponse<Preload> {
  @ApiProperty({
    description: 'Status code',
    example: 200,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: 'Upload image successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Data of image',
    type: Preload,
  })
  @Type(() => Preload)
  data: Preload;
}

export class PreloadError_Failed extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: PRELOAD_ROUTE.FAILED,
  })
  message: string;
}

export class PreloadError_InvalidType extends UnsupportedMediaType<string> {
  @ApiProperty({
    description: 'Message',
    example: PRELOAD_ROUTE.INVALID_TYPE,
  })
  message: string;
}
