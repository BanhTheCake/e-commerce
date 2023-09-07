import { Injectable, Inject } from '@nestjs/common';
import { CloudinaryOpts, CloudinaryResponse } from './cloudinary.interface';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CLOUDINARY_OPTIONS } from './cloudinary.constant';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY_OPTIONS) private readonly opts: CloudinaryOpts,
  ) {}
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: this.opts.upload_preset,
          folder: this.opts.folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteImage(publicId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result); // response of result = { result: 'ok' }
      });
    });
  }
}
