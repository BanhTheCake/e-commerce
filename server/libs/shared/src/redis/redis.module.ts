import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisServices } from './redis.services';
import { RedisAsyncOptions, RedisOptions } from './redis.interface';
import { REDIS, REDIS_OPTIONS } from './redis.constant';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [RedisServices],
  exports: [RedisServices],
})
export class RedisModule {
  public static register(otps: RedisAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_OPTIONS,
          useFactory: otps.useFactory,
          inject: otps.inject || [],
        },
        {
          provide: REDIS,
          useFactory: async (opts: RedisOptions) => {
            const client = createClient(opts);
            return client;
          },
          inject: [REDIS_OPTIONS],
        },
      ],
    };
  }
}
