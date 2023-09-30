import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from '@app/shared';
import {
  Images,
  ProductDetails,
  Products,
  Products_Categories,
} from '@/entities';
import { CategoriesModule } from '@/categories/categories.module';
import { ImagesModule } from '@/images/images.module';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';
import { settings, mappings } from './products.mapping';
import { UsersModule } from '@/users/users.module';
import { BullModule } from '@nestjs/bull';
import { ProductConsumer } from './products.consumer';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Products,
      Products_Categories,
      Images,
      ProductDetails,
    ]),
    CategoriesModule,
    ImagesModule,
    forwardRef(() => UsersModule),
    BullModule.registerQueue({
      name: 'products',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductConsumer],
  exports: [ProductsService],
})
export class ProductsModule implements OnModuleInit {
  constructor(private elasticSearchService: ElasticSearchService) {}
  onModuleInit() {
    this.elasticSearchService.createIndex({
      index: 'products',
      mappings,
      settings,
    });
  }
}
