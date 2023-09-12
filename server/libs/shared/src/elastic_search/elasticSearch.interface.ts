import { ModuleMetadata } from '@nestjs/common';
import { ClientOptions } from '@elastic/elasticsearch';

export type ElasticAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory?: (...args: any[]) => ClientOptions;
  inject?: any[];
};
