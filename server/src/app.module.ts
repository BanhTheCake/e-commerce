import { CloudinaryModule, DatabaseModule } from '@app/shared';
import { ElasticSearchModule } from '@app/shared/elastic_search/elasticSearch.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { CategoriesModule } from './categories/categories.module';
import { Images, Products, Tokens, Users } from './entities';
import { Categories } from './entities/category.entity';
import { Products_Categories } from './entities/products-categories.entity';
import { ImagesModule } from './images/images.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './entities/comment.entity';
import { Followers } from './entities/follower.entity';
import { Carts } from './entities/cart.entity';
import { CartItems } from './entities/cartItem.entity';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DatabaseModule.forRoot([
      Users,
      Products,
      Tokens,
      Images,
      Products_Categories,
      Categories,
      Comments,
      Followers,
      Carts,
      CartItems,
    ]),
    ScheduleModule.forRoot(),
    CloudinaryModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          cloud_name: configService.getOrThrow<string>('CLOUDINARY_NAME'),
          api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
          upload_preset: configService.getOrThrow<string>(
            'CLOUDINARY_UPLOAD_PRESET',
          ),
          folder: configService.getOrThrow<string>('CLOUDINARY_FOLDER'),
        };
      },
      inject: [ConfigService],
    }),
    ElasticSearchModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          node: configService.getOrThrow<string>('ELASTIC_SEARCH_URL'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    ImagesModule,
    ProductsModule,
    CategoriesModule,
    CommentsModule,
    CartsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
