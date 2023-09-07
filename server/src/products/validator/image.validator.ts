import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const isValidType = Boolean(RegExp(/(jpeg|jpg|png)$/).exec(file.mimetype));
  if (!isValidType) {
    return callback(
      new UnsupportedMediaTypeException(
        'image only allowed type jpeg, jpg, png',
      ),
      false,
    );
  }

  // if options don't has MulterOptions then use this one

  //   const MAX_SIZE = 1024 * 1024 * 1; // 1MB
  //   const isValidSize = file.size <= MAX_SIZE;
  //   if (!isValidSize) {
  //     return callback(
  //       new PayloadTooLargeException('image size must be less than 1MB'),
  //       false,
  //     );
  //   }
  return callback(null, true);
};

export const imageOptions: MulterOptions = {
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 1, // 5MB
  },
};
