import { DynamicModule, Global, Module } from '@nestjs/common';
import { ElasticSearchService } from './elasticSearch.service';
import { Client, ClientOptions } from '@elastic/elasticsearch';
import { ElasticAsyncOptions } from './elasticSearch.interface';
import {
  ELASTIC_SEARCH_OPTS,
  ELASTIC_SEARCH_SERVICE,
} from './elasticSearch.constant';

@Global()
@Module({
  providers: [ElasticSearchService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {
  public static forRootAsync(opts: ElasticAsyncOptions): DynamicModule {
    return {
      module: ElasticSearchModule,
      imports: opts.imports || [],
      providers: [
        {
          provide: ELASTIC_SEARCH_OPTS,
          useFactory: opts.useFactory,
          inject: opts.inject || [],
        },
        {
          provide: ELASTIC_SEARCH_SERVICE,
          useFactory: (opts: ClientOptions) => {
            return new Client(opts);
          },
          inject: [ELASTIC_SEARCH_OPTS],
        },
      ],
    };
  }
}
