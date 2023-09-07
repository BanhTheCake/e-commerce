import { ParseFilePipe, UploadedFile, UploadedFiles } from '@nestjs/common';

export const UploadFilesRequired = () => {
  return UploadedFiles(new ParseFilePipe({ fileIsRequired: true }));
};

export const UploadFileRequired = () => {
  return UploadedFile(new ParseFilePipe({ fileIsRequired: true }));
};
