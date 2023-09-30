import { CartItems, Carts } from '@/entities';
import { HistoriesModule } from '@/history/history.module';
import { ProductsModule } from '@/products/products.module';
import { DatabaseModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { CartsConsumer } from './carts.consumer';
import { CartsController } from './carts.controller';
import { CartsServices } from './carts.services';

@Module({
  imports: [
    DatabaseModule.forFeature([Carts, CartItems]),
    BullModule.registerQueue({
      name: 'carts',
    }),
    forwardRef(() => ProductsModule),
    HistoriesModule,
  ],
  controllers: [CartsController],
  providers: [CartsServices, CartsConsumer],
  exports: [CartsServices],
})
export class CartsModule {}
