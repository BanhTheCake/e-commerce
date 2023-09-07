import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { CreateNewCategoryDto } from './dto/create-new-category.dto';
import { GetAllCategoriesDto } from './dto/get-all-categories.dto';
import {
  UpdateCategoryDto,
  UpdateCategoryParamsDto,
} from './dto/update-category.dto';
import { DeleteCategoryParamsDto } from './dto/delete-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import {
  CreateNewCategoryError_Exist,
  CreateNewCategoryResponse,
} from './dto/create-new-category-response.dto';
import { InternalServerError } from '@/errors/internal-server.error';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { CategoryResponse } from './dto/category.response';
import {
  UpdateCategoryError_NotFound,
  UpdateCategoryResponse,
} from './dto/update-category-response.dto';
import {
  DeleteCategoryError_NotFound,
  DeleteCategoryResponse,
} from './dto/delete-category-response.dto';
import { GetAllCategoryResponse } from './dto/get-all-category-response.dto';

@ApiTags('Categories')
@ApiAuth()
@ApiInternalServerErrorResponse({ type: InternalServerError })
@AuthWithAccessToken()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @Serialize(CategoryResponse)
  @ApiOperation({ summary: 'Create new category' })
  @ApiOkResponse({ type: CreateNewCategoryResponse })
  @ApiBadRequestResponse({ type: CreateNewCategoryError_Exist })
  createNewCategory(@Body() data: CreateNewCategoryDto) {
    return this.categoriesService.createNew(data);
  }

  @Put('update/:id')
  @Serialize(CategoryResponse)
  @ApiOperation({ summary: 'Update current category with id' })
  @ApiOkResponse({ type: UpdateCategoryResponse })
  @ApiBadRequestResponse({ type: UpdateCategoryError_NotFound })
  updateCategory(
    @Param() { id }: UpdateCategoryParamsDto,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateOne(id, data);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete category with id' })
  @ApiOkResponse({ type: DeleteCategoryResponse })
  @ApiBadRequestResponse({ type: DeleteCategoryError_NotFound })
  deleteCategory(@Param() { id }: DeleteCategoryParamsDto) {
    return this.categoriesService.deleteOne(id);
  }

  @Get()
  @Serialize(CategoryResponse)
  @ApiOperation({ summary: 'Get all categories with query' })
  @ApiOkResponse({ type: GetAllCategoryResponse })
  getAllCategories(@Query() data: GetAllCategoriesDto) {
    return this.categoriesService.getAll(data);
  }
}
