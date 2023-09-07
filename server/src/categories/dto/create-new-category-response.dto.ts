import { CREATE_CATEGORY_ROUTE } from '@/constant/category.constant';
import { Categories } from '@/entities/category.entity';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from './category.response';

export class CreateNewCategoryResponse implements IResponse<CategoryResponse> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: CREATE_CATEGORY_ROUTE.SUCCESS,
  })
  message: string;

  @ApiProperty({
    description: 'Data of category',
  })
  data: CategoryResponse;
}

export class CreateNewCategoryError_Exist extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: CREATE_CATEGORY_ROUTE.ALREADY_EXIST,
  })
  message: string;
}
