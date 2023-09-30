import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { CreateNewDto } from './dto/create-new.dto';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ProductResponse } from './dto/product.response';
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
import { GetRelativesDto } from './dto/get-relatives.dto';

@ApiTags('Products')
@Controller('products')
@ApiInternalServerErrorResponse({ type: InternalServerError })
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('create')
  @AuthWithAccessToken()
  // @Serialize(ProductResponse)
  @ApiOperation({ summary: 'Create new product' })
  @ApiAuth()
  @ApiCreatedResponse({ type: CreateNewProductResponse })
  @ApiBadRequestResponse({ type: CreateNewProductError_LabelExist })
  createNew(@Body() data: CreateNewDto, @User() user: Users) {
    return this.productsService.createNew(data, user);
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
  @ApiOperation({ summary: 'Update product with id' })
  @ApiAuth()
  @ApiExtraModels(UpdateProductError_NotFound, UpdateProductError_Nothing)
  @ApiOkResponse({ type: UpdateProductResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(UpdateProductError_NotFound, UpdateProductError_Nothing),
    },
  })
  updateOne(@Param() param: UpdateParamDto, @Body() data: UpdateBodyDto) {
    if (isEmpty(data)) {
      throw new BadRequestException(UPDATE_PRODUCT_ROUTE.NOTHING);
    }
    return this.productsService.updateOne(param, data);
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

  @Get('relative')
  @Serialize(ProductResponse)
  @ApiOperation({ summary: 'Get all product relative' })
  @ApiOkResponse({ type: GetProductsResponse })
  getRelatives(@Query() data: GetRelativesDto) {
    return this.productsService.findAllRelative(data);
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
