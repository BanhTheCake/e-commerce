import { CloudinaryModule, DatabaseModule, RedisModule } from '@app/shared';
import { ElasticSearchModule } from '@app/shared/elastic_search/elasticSearch.module';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import {
  CartItems,
  Carts,
  Categories,
  Comments,
  Followers,
  Histories,
  Images,
  ProductDetails,
  ProductHistories,
  Products,
  Products_Categories,
  Users,
} from './entities';
import { HistoriesModule } from './history/history.module';
import { ImagesModule } from './images/images.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DatabaseModule.forRoot([
      Users,
      Products,
      Images,
      Products_Categories,
      Categories,
      Comments,
      Followers,
      Carts,
      CartItems,
      Histories,
      ProductHistories,
      ProductDetails,
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
    RedisModule.register({
      useFactory: (configService: ConfigService) => {
        return {
          url: configService.getOrThrow<string>('REDIS_URI'),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_POST'),
          },
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 2, // try 1 times when error
            backoff: 1000, // wait 1s before each retry
          },
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_POST'),
          },
          ttl: 1000 * 60 * 5, // 1 minute,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    UsersModule,
    ImagesModule,
    ProductsModule,
    CategoriesModule,
    CommentsModule,
    CartsModule,
    HistoriesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
