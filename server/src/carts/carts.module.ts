import { Carts } from '@/entities/cart.entity';
import { CartItems } from '@/entities/cartItem.entity';
import { DatabaseModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsServices } from './carts.services';
import { ProductsModule } from '@/products/products.module';
import { HistoriesModule } from '@/history/history.module';
import { BullModule } from '@nestjs/bull';
import { CartsConsumer } from './carts.consumer';

@Module({
  imports: [
    DatabaseModule.forFeature([Carts, CartItems]),
    BullModule.registerQueue({
      name: 'carts',
    }),
    ProductsModule,
    HistoriesModule,
  ],
  controllers: [CartsController],
  providers: [CartsServices, CartsConsumer],
  exports: [CartsServices],
})
export class CartsModule {}
