import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { DatabaseModule } from '@app/shared';
import { Images } from '@/entities';
import { ImageSubscriber } from './images.subscriber';
import { ImagesController } from './images.controller';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [DatabaseModule.forFeature([Images])],
  controllers: [ImagesController],
  providers: [ImagesService, ImageSubscriber],
  exports: [ImagesService],
})
export class ImagesModule {}
