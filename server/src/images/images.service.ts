import { Images, Products, Users } from '@/entities';
import { ImageType } from '@/entities/enum';
import { ProductResponse } from '@/products/dto/product.response';
import { CloudinaryService, isUploadSuccess } from '@app/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly cloudinaryService: CloudinaryService,
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
    upload: {
      single: async (file: Express.Multer.File, entity: Users | Products) => {
        const imageObj = await this.cloudinaryService.uploadFile(file);
        if (!isUploadSuccess(imageObj)) {
          throw new BadRequestException('Upload failed! Please try again.');
        }
        if (entity instanceof Users) {
          const newImage = this.imagesRepository.create({
            url: imageObj.secure_url,
            publicKey: imageObj.public_id,
            user: entity,
          });
          await this.imagesRepository.save(newImage);
          return newImage;
        }
        if (entity instanceof Products) {
          console.log('2');
          const newImage = this.imagesRepository.create({
            url: imageObj.secure_url,
            publicKey: imageObj.public_id,
            product: entity,
            role: ImageType.PRODUCT,
          });
          await this.imagesRepository.save(newImage);
          return newImage;
        }
        throw new BadRequestException('Your entity is not supported.');
      },
      multi: async (
        files: Array<Express.Multer.File>,
        entity: ProductResponse | Products,
        queryRunner: QueryRunner,
      ) => {
        const imageArr = await Promise.all(
          files.map(async (file) => {
            const imageObj = await this.cloudinaryService.uploadFile(file);
            if (!isUploadSuccess(imageObj)) {
              throw new BadRequestException('Upload failed! Please try again.');
            }
            return imageObj;
          }),
        );
        const imagesEntity = imageArr.map<Partial<Images>>((imageObj) => {
          return {
            url: imageObj.secure_url,
            publicKey: imageObj.public_id,
            productId: entity.id,
            role: ImageType.PRODUCT,
          };
        });
        const newImages = this.imagesRepository.create(imagesEntity);
        await queryRunner.manager.save(newImages);
        return newImages;
      },
    },
  };
}
