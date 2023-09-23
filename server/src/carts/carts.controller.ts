import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CartsServices } from './carts.services';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { AddToDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';
import { PaymentDto } from './dto/payment.dto';
import { DeleteDto } from './dto/delete.dto';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { InternalServerError } from '@/errors/internal-server.error';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import {
  AddToCartError_OutOfStock,
  AddToCartError_ProductNotFound,
  AddToCartResponse,
  CartItemResponse,
} from './dto/add-response.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import {
  PaymentError_OutOfStock,
  PaymentError_ProductNotFound,
  PaymentResponse,
} from './dto/payment-response.dto';
import {
  UpdateCartError_OutOfStock,
  UpdateCartError_ProductNotFound,
  UpdateCartResponse,
} from './dto/update-response.dto';
import { DeleteCartResponse } from './dto/delete-response.dto';
import { GetCartItemsResponse } from './dto/get-response.dto';

@ApiTags('carts')
@ApiInternalServerErrorResponse({
  type: InternalServerError,
})
@Controller('carts')
export class CartsController {
  constructor(private cartsServices: CartsServices) {}

  @Post('add')
  @AuthWithAccessToken()
  @Serialize(CartItemResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Add to cart' })
  @ApiExtraModels(AddToCartError_ProductNotFound, AddToCartError_OutOfStock)
  @ApiOkResponse({
    type: AddToCartResponse,
  })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(AddToCartError_ProductNotFound, AddToCartError_OutOfStock),
    },
  })
  addToCart(@Body() data: AddToDto) {
    return this.cartsServices.addToCart(data);
  }

  @Post('payment')
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Payment' })
  @ApiExtraModels(PaymentError_OutOfStock, PaymentError_ProductNotFound)
  @ApiOkResponse({ type: PaymentResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(PaymentError_OutOfStock, PaymentError_ProductNotFound),
    },
  })
  payment(@Body() data: PaymentDto, @User() user: Users) {
    return this.cartsServices.payment(data, user.id);
  }

  @Patch('update')
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Update cart' })
  @ApiExtraModels(UpdateCartError_ProductNotFound, UpdateCartError_OutOfStock)
  @ApiOkResponse({ type: UpdateCartResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(UpdateCartError_ProductNotFound, UpdateCartError_OutOfStock),
    },
  })
  updateCart(@Body() data: UpdateDto) {
    return this.cartsServices.updateCart(data);
  }

  @Delete('delete')
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Delete cart' })
  @ApiOkResponse({ type: DeleteCartResponse })
  deleteCartItem(@Body() data: DeleteDto) {
    return this.cartsServices.deleteCart(data);
  }

  @Get()
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Get cart items' })
  @ApiOkResponse({ type: GetCartItemsResponse })
  getCartItems(@User() user: Users) {
    return this.cartsServices.getCartItems(user.id);
  }
}
