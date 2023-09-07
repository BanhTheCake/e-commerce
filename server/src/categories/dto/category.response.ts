import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponse {
  @ApiProperty({
    description: 'Id of user',
    example: '21ca7acc-3276-4178-856a-50f1e85c97fb',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'label',
    example: 'Thực Phẩm Và Đồ Uống',
  })
  @Expose()
  label: string;

  @ApiProperty({
    description: 'Slug',
    example: 'thuc-pham-va-do-uong',
  })
  @Expose()
  slug: string;

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
