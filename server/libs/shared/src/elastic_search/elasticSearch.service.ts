import {
  Client,
  TransportRequestOptionsWithOutMeta,
} from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';
import { ELASTIC_SEARCH_SERVICE } from './elasticSearch.constant';
import {
  AggregationsAggregate,
  CountRequest,
  CreateRequest,
  DeleteRequest,
  IndicesCreateRequest,
  SearchRequest,
  SearchResponse,
  UpdateByQueryRequest,
  UpdateRequest,
} from '@elastic/elasticsearch/lib/api/types';
import { isEmpty } from 'lodash';

@Injectable()
export class ElasticSearchService {
  constructor(
    @Inject(ELASTIC_SEARCH_SERVICE) private readonly client: Client,
  ) {}

  async createIndex({ index, ...settings }: IndicesCreateRequest) {
    const isExist = await this.client.indices.exists({ index });
    if (isExist) {
      return;
    }
    await this.client.indices.create({
      index,
      ...settings,
    });

    console.log(`[ELASTIC]: create index with name ${index} success`);
  }

  async createNewDoc<T>({ index, id, document }: CreateRequest<T>) {
    return await this.client.create({
      index: index,
      id: id,
      document,
    });
  }

  async deleteDoc({ index, id }: DeleteRequest) {
    return this.client.delete({
      index,
      id,
    });
  }

  async updateDoc<T>({ index, doc, id }: UpdateRequest<unknown, T>) {
    if (isEmpty(doc)) {
      return;
    }
    return await this.client.update({
      index,
      id,
      doc,
    });
  }

  async updateByQuery(params: UpdateByQueryRequest) {
    return this.client.updateByQuery(params);
  }

  getClient() {
    return this.client;
  }

  async search<T>(
    params: SearchRequest,
    opts?: TransportRequestOptionsWithOutMeta,
  ): Promise<SearchResponse<T, Record<string, AggregationsAggregate>>> {
    return this.client.search(params, opts);
  }

  async count(params: CountRequest, opts?: TransportRequestOptionsWithOutMeta) {
    return this.client.count(params, opts);
  }

  async bulk(operations: any, index: string) {
    const bulkResponse = await this.client.bulk({ refresh: true, operations });
    if (bulkResponse.errors) {
      throw new Error('Insert failed');
    }
    return await this.count({ index });
  }

  hello() {
    return 'hello';
  }
}
