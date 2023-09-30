import { CloudinaryService, RedisServices } from '@app/shared';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ImagesEvent implements OnModuleInit {
  constructor(
    private redisService: RedisServices,
    private cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    this.redisService.pSubscribe('__keyevent@0__:expired', (message) => {
      if (typeof message !== 'string') return;
      if (!message.includes('preload:image')) return;
      const publicKey = message.split(':')[2];
      if (!publicKey) return;
      this.cloudinaryService.deleteImage(publicKey);
    });
  }
}
