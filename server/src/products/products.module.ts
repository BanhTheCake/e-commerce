import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from '@app/shared';
import { Images, Products } from '@/entities';
import { CategoriesModule } from '@/categories/categories.module';
import { Products_Categories } from '@/entities/products-categories.entity';
import { ImagesModule } from '@/images/images.module';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';
import { settings, mappings } from './products.mapping';

@Module({
  imports: [
    DatabaseModule.forFeature([Products, Products_Categories, Images]),
    CategoriesModule,
    ImagesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
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
