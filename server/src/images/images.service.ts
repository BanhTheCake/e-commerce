import { Images, Products, Users } from '@/entities';
import { ImageType } from '@/entities/enum';
import { CloudinaryService, isUploadSuccess } from '@app/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File, entity: Users | Products) {
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
  }

  // uploadFiles
  async uploadImages(
    files: Array<Express.Multer.File>,
    entity: Products,
    queryRunner: QueryRunner,
  ) {
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
        product: entity,
        role: ImageType.PRODUCT,
      };
    });
    const newImages = this.imagesRepository.create(imagesEntity);
    await queryRunner.manager.save(newImages);
    return newImages;
  }

  async uploadImagesNoTransaction(
    files: Array<Express.Multer.File>,
    entity: Products,
  ) {
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
        product: entity,
        role: ImageType.PRODUCT,
      };
    });
    const newImages = this.imagesRepository.create(imagesEntity);
    await this.imagesRepository.save(newImages);
    return newImages;
  }

  async deleteFiles(filesId: string[], queryRunner: QueryRunner) {
    const imagesDelete = await this.imagesRepository.find({
      where: { id: In(filesId) },
    });
    await queryRunner.manager.remove(imagesDelete);
    return imagesDelete;
  }
}
