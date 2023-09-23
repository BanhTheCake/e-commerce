import { ModuleMetadata } from '@nestjs/common';
import { createClient } from 'redis';

export type RedisOptions = Parameters<typeof createClient>[0];

export type RedisAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory?: (...args: any[]) => RedisOptions;
  inject?: any[];
};
