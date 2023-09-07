import { UPDATE_CATEGORY_ROUTE } from '@/constant/category.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from './category.response';

export class UpdateCategoryResponse implements IResponse<CategoryResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: UPDATE_CATEGORY_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data of category',
  })
  data: CategoryResponse;
}

export class UpdateCategoryError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: UPDATE_CATEGORY_ROUTE.NOT_FOUND,
  })
  message: string;
}
