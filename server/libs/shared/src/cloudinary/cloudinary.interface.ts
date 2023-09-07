import { ModuleMetadata } from '@nestjs/common';
import { ConfigOptions } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
export type CloudinaryOpts = ConfigOptions & {
  upload_preset: string;
  folder: string;
};
export type CloudinaryAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory?: (...args: any[]) => CloudinaryOpts;
  inject?: any[];
};

export const isUploadSuccess = (
  response: CloudinaryResponse,
): response is UploadApiResponse => {
  return 'public_id' in response;
};
