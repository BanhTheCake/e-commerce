import { UserRoles } from '@/entities/enum';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const userResponseExample = {
  id: '21ca7acc-3276-4178-856a-50f1e85c97fb',
  username: 'binhanh',
  email: 'binhanh054@gmail.com',
  address: null,
  avatar: null,
  created_at: '2023-09-03T22:20:02.569Z',
  updated_at: '2023-09-03T22:20:02.569Z',
  role: 'user',
};

export class UserResponse {
  @ApiProperty({
    description: 'Id of user',
    example: '21ca7acc-3276-4178-856a-50f1e85c97fb',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'binhanh',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'Email',
    example: 'binhanh054@gmail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Address',
    example: '2/12/32 tp Ho Chi Minh',
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Avatar link',
    example:
      'https://res.cloudinary.com/banhthecake/image/upload/v1693765293/ecommerce/q4hocl4tgzar2gs1sdog.jpg',
  })
  @Expose()
  avatar: string;

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

  @ApiProperty({
    description: 'Role',
    example: 'user',
  })
  @Expose()
  role: UserRoles;
}
