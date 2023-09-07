import { DELETE_CATEGORY_ROUTE } from '@/constant/category.constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { IResponse } from '@/response/response';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryResponse implements IResponse<never> {
  @ApiProperty({
    description: 'Error Code',
    example: 0,
  })
  errCode: number;

  @ApiProperty({
    description: 'Message',
    example: DELETE_CATEGORY_ROUTE.SUCCESS,
  })
  message: string;
}

export class DeleteCategoryError_NotFound extends BadRequestError<string> {
  @ApiProperty({
    description: 'Message',
    example: DELETE_CATEGORY_ROUTE.NOT_FOUND,
  })
  message: string;
}
