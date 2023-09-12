import { CloudinaryService } from '@app/shared';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
} from 'typeorm';
import { Images } from '@/entities';
import { ImageType } from '@/entities/enum';
import { InjectRepository } from '@nestjs/typeorm';

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
    if (event.entity.role === ImageType.PRODUCT) return;
    const deleteImage = await this.imagesRepository.findOne({
      where: { ownerId: event.entity.ownerId },
    });
    console.log(deleteImage);
    if (!deleteImage) {
      return;
    }
    await this.imagesRepository.remove(deleteImage);
  }

  // Remove image in cloudinary
  async afterRemove(event: RemoveEvent<Images>) {
    if (!event.entity.publicKey) return;
    this.cloudinaryService.deleteImage(event.entity.publicKey);
  }
}
