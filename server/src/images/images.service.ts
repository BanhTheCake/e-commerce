import { Images } from '@/entities';
import { CloudinaryService, RedisServices, isUploadSuccess } from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DataSource, DeepPartial, Repository } from 'typeorm';

type ICreateImage =
  | {
      key: 'product';
      data: Pick<
        DeepPartial<Images>,
        'id' | 'url' | 'publicKey' | 'productId'
      >[];
    }
  | {
      key: 'user';
      data: Pick<DeepPartial<Images>, 'id' | 'url' | 'publicKey' | 'ownerId'>[];
    }
  | {
      key: 'category';
      data: Pick<
        DeepPartial<Images>,
        'id' | 'url' | 'publicKey' | 'categoryId'
      >[];
    };

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly cloudinaryService: CloudinaryService,
    private readonly redisService: RedisServices,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: (alias: string) =>
      this.imagesRepository.createQueryBuilder(alias),
    startTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
    bulkInsert: async (imageList: Partial<Images>[]) => {
      const imageEntities = this.imagesRepository.create(imageList);
      return await this.imagesRepository.save(imageEntities);
    },
    create: (input: ICreateImage) => {
      const { data } = input;
      for (const entity of data) {
        if (entity.publicKey) {
          this.cacheManager.del(`preload:image:${entity.publicKey}`);
        }
      }
      return this.imagesRepository.create(data);
    },
  };

  // ================= FOR ROUTE =====================

  async upload(file: Express.Multer.File) {
    const imageObj = await this.cloudinaryService.uploadFile(file);
    if (!isUploadSuccess(imageObj)) {
      throw new BadRequestException('Upload failed! Please try again.');
    }
    this.cacheManager.set(
      `preload:image:${imageObj.public_id}`,
      1,
      1000 * 60 * 30, // 30 minutes
    );
    const data = {
      url: imageObj.url,
      secure: imageObj.secure_url,
      publicId: imageObj.public_id,
    };
    return {
      errCode: 0,
      message: 'Upload success',
      data,
    };
  }
}
