import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Param,
  Delete,
  Put,
  UploadedFiles,
  BadRequestException,
  Query,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { CreateNewDto } from './dto/create-new.dto';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ProductResponse } from './dto/product.response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './validator/image.validator';
import { UploadFilesRequired } from '@/decorators/image.decorator';
import { GetOneParamDto } from './dto/get-one-param.dto';
import { DeleteDto } from './dto/delete.dto';
import { UpdateBodyDto, UpdateParamDto } from './dto/update.dto';
import { isEmpty } from 'lodash';
import { GetAllQueryDto } from './dto/get-all.dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiConsumes,
  refs,
  ApiExtraModels,
} from '@nestjs/swagger';
import { InternalServerError } from '@/errors/internal-server.error';
import {
  CreateNewProductError_LabelExist,
  CreateNewProductResponse,
} from './dto/create-new-response.dto';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import { GetProductResponse } from './dto/get-one-reponse.dto';
import {
  DeleteProductError_NotFound,
  DeleteProductResponse,
} from './dto/delete-response.dto';
import { UPDATE_PRODUCT_ROUTE } from '@/constant/product.constant';
import {
  UpdateProductError_NotFound,
  UpdateProductError_Nothing,
  UpdateProductResponse,
} from './dto/update-response.dto';
import { GetProductsResponse } from './dto/get-all-response.dto';
import { SuggestDto } from './dto/suggest.dto';
import { SuggestResponse } from './dto/suggest-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('Products')
@Controller('products')
@ApiInternalServerErrorResponse({ type: InternalServerError })
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('create')
  @AuthWithAccessToken()
  @Serialize(ProductResponse)
  @UseInterceptors(FilesInterceptor('files', 5, imageOptions))
  @ApiOperation({ summary: 'Create new product' })
  @ApiAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateNewProductResponse })
  @ApiBadRequestResponse({ type: CreateNewProductError_LabelExist })
  createNew(
    @Body() data: CreateNewDto,
    @User() user: Users,
    @UploadFilesRequired()
    files: Array<Express.Multer.File>,
  ) {
    return this.productsService.createNew(data, user, files);
  }

  @Delete(':id')
  @AuthWithAccessToken()
  @ApiOperation({ summary: 'Delete product with id' })
  @ApiAuth()
  @ApiOkResponse({ type: DeleteProductResponse })
  @ApiBadRequestResponse({ type: DeleteProductError_NotFound })
  deleteOne(@Param() data: DeleteDto) {
    return this.productsService.deleteOne(data);
  }

  @Put(':id')
  @AuthWithAccessToken()
  @UseInterceptors(FilesInterceptor('files', 5, imageOptions))
  @ApiOperation({ summary: 'Update product with id' })
  @ApiAuth()
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateProductError_NotFound, UpdateProductError_Nothing)
  @ApiOkResponse({ type: UpdateProductResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(UpdateProductError_NotFound, UpdateProductError_Nothing),
    },
  })
  updateOne(
    @Param() param: UpdateParamDto,
    @Body() data: UpdateBodyDto,
    @UploadedFiles() files: Array<Express.Multer.File> | undefined,
  ) {
    if (isEmpty(data) && !files) {
      throw new BadRequestException(UPDATE_PRODUCT_ROUTE.NOTHING);
    }
    return this.productsService.updateOne(param, data, files);
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Get auto suggest' })
  @ApiOkResponse({ type: SuggestResponse })
  autoSuggest(@Query() data: SuggestDto) {
    return this.productsService.autoSuggest(data);
  }

  @Get('elastic')
  @Serialize(ProductResponse)
  @ApiOperation({ summary: 'Get all product with special filter (elastic)' })
  @ApiOkResponse({ type: GetProductsResponse })
  getAllElastic(@Query() data: GetAllQueryDto) {
    return this.productsService.findAllElastic(data);
  }

  @Get(':id')
  @Serialize(ProductResponse)
  @ApiOperation({ summary: 'Get one product with id' })
  @ApiOkResponse({ type: GetProductResponse })
  getOne(@Param() data: GetOneParamDto) {
    return this.productsService.findOne(data);
  }

  @Get()
  @Serialize(ProductResponse)
  @ApiOperation({ summary: 'Get all product with special filter' })
  @ApiOkResponse({ type: GetProductsResponse })
  getAll(@Query() data: GetAllQueryDto) {
    return this.productsService.findAll(data);
  }
}
