import { Images } from '@/entities';
import { CloudinaryService } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
} from 'typeorm';

@EventSubscriber()
export class ImageSubscriber implements EntitySubscriberInterface<Images> {
  constructor(
    dataSource: DataSource,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Images;
  }

  // Delete user's image
  async beforeInsert(event: InsertEvent<Images>): Promise<any> {
    if (event.entity.ownerId) {
      await this.imagesRepository.delete({
        ownerId: event.entity.ownerId,
      });
      return;
    }
    if (event.entity.categoryId) {
      await this.imagesRepository.delete({
        categoryId: event.entity.categoryId,
      });
    }
  }

  // Remove image in cloudinary
  async afterRemove(event: RemoveEvent<Images>) {
    if (!event.entity?.publicKey) return;
    this.cloudinaryService.deleteImage(event.entity.publicKey);
  }
}
