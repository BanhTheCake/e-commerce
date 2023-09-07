import { Module, Global, DynamicModule } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY, CLOUDINARY_OPTIONS } from './cloudinary.constant';
import { CloudinaryAsyncOptions } from './cloudinary.interface';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

@Global()
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {
  public static registerAsync(opts: CloudinaryAsyncOptions): DynamicModule {
    return {
      module: CloudinaryModule,
      providers: [
        {
          provide: CLOUDINARY_OPTIONS,
          useFactory: opts.useFactory,
          inject: opts.inject || [],
        },
        {
          provide: CLOUDINARY,
          useFactory: (opts: ConfigOptions) => {
            return cloudinary.config(opts);
          },
          inject: [CLOUDINARY_OPTIONS],
        },
      ],
      exports: [CLOUDINARY],
    };
  }
}
