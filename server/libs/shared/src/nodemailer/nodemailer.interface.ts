import { ModuleMetadata } from '@nestjs/common';

export type NodemailerOptions = {
  clientId: string;
  clientSecret: string;
  refresh_token: string;
  user: string;
};

export type NodemailerAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory?: (...args: any[]) => NodemailerOptions;
  inject?: any[];
};

export type MailOptions = {
  to: string; // Gửi đến ai?
  subject: string; // Tiêu đề email
  html: string; // Nội dung email
};
