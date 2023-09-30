import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateNewQueue } from './queue/create-new.queue';
import { ProductResponse } from './dto/product.response';

@Processor('products')
export class ProductConsumer {
  constructor(private elasticSearch: ElasticSearchService) {}

  @Process({
    name: 'Add new product',
    concurrency: 5,
  })
  async addNewProduct(job: Job<CreateNewQueue<ProductResponse>>) {
    const { index, id, document } = job.data;
    await this.elasticSearch.createNewDoc<ProductResponse>({
      index: index,
      id: id,
      document: document,
    });
    return { message: 'Ok' };
  }
}
