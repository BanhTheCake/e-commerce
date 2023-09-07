import { GET_ALL_CATEGORY_ROUTE } from '@/constant/category.constant';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from './category.response';

export class GetAllCategoryResponse implements IResponse<CategoryResponse[]> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: GET_ALL_CATEGORY_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'List of category with query',
    isArray: true,
    type: CategoryResponse,
  })
  data: CategoryResponse[];
}
