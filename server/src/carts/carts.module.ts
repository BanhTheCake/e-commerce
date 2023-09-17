import { Carts } from '@/entities/cart.entity';
import { CartItems } from '@/entities/cartItem.entity';
import { DatabaseModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsServices } from './carts.services';

@Module({
  imports: [DatabaseModule.forFeature([Carts, CartItems])],
  controllers: [CartsController],
  providers: [CartsServices],
  exports: [CartsServices],
})
export class CartsModule {}
