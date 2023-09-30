import { Images, Products, Users } from '@/entities';
import { ImageType } from '@/entities/enum';
import { ProductResponse } from '@/products/dto/product.response';
import { CloudinaryService, RedisServices, isUploadSuccess } from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DataSource, DeepPartial, QueryRunner, Repository } from 'typeorm';

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
    create: (entityLikeArray: DeepPartial<Images>[]) => {
      for (const entity of entityLikeArray) {
        if (entity.publicKey) {
          this.cacheManager.del(`preload:image:${entity.publicKey}`);
        }
      }
      return this.imagesRepository.create(entityLikeArray);
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
