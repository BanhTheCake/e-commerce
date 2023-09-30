import { Inject, Injectable } from '@nestjs/common';
import { REDIS } from './redis.constant';
import { createClient } from 'redis';

@Injectable()
export class RedisServices {
  constructor(
    @Inject(REDIS)
    private readonly redisClient: ReturnType<typeof createClient>,
  ) {}

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async exist(key: string) {
    return this.redisClient.exists(key);
  }

  async setnx(key: string, value: any) {
    return this.redisClient.set(key, value, {
      NX: true,
    });
  }

  async set(key: string, value: any) {
    return this.redisClient.set(key, value);
  }

  async incrBy(key: string, value: number) {
    return this.redisClient.incrBy(key, value);
  }

  async del(key: string) {
    return this.redisClient.del(key);
  }

  async jsonSet(key: string, path, value: any) {
    return this.redisClient.json.set(key, path, value);
  }

  async jsonGet<T>(key: string, path: string) {
    const data = await this.redisClient.json.get(key, {
      path,
    });
    return JSON.parse(data as string) as T;
  }

  async hset(key: string, field: any, value: any) {
    return this.redisClient.hSet(key, field, value);
  }

  async hget(key: string, field: any) {
    return this.redisClient.hGet(key, field);
  }

  async hgetall(key: string) {
    return this.redisClient.hGetAll(key);
  }

  async hincrby(key: string, field: any, value: number) {
    return this.redisClient.hIncrBy(key, field, value);
  }

  async hkeys(key: string) {
    return this.redisClient.hKeys(key);
  }

  async hdel(key: string, field: any) {
    return this.redisClient.hDel(key, field);
  }

  async setAdd(key: string, value: any) {
    return this.redisClient.sAdd(key, value);
  }

  async setIsMember(key: string, value: any) {
    return this.redisClient.sIsMember(key, value);
  }

  pSubscribe(
    key: Parameters<(typeof this.redisClient)['pSubscribe']>[0],
    callback: Parameters<(typeof this.redisClient)['pSubscribe']>[1],
  ) {
    return this.redisClient.pSubscribe(key, callback);
  }
}
