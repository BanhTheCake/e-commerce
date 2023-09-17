import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CartsServices } from './carts.services';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { AddToDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('carts')
export class CartsController {
  constructor(private cartsServices: CartsServices) {}

  @Post('add')
  @AuthWithAccessToken()
  addToCart(@Body() data: AddToDto, @User() user: Users) {
    return this.cartsServices.addToCart(data, user.id);
  }

  @Patch('update')
  updateCart(@Body() data: UpdateDto) {
    return this.cartsServices.updateCart(data);
  }

  @Get()
  @AuthWithAccessToken()
  getCartItems(@User() user: Users) {
    return this.cartsServices.getCartItems(user.id);
  }
}
