import { Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Processor } from '@nestjs/bull';
import { StarType, UpdateStarQueue } from './queue/update-star.queue';
import { ProductsService } from '@/products/products.service';
import { CommentServices } from './comments.service';
import { BadRequestException } from '@nestjs/common';

@Processor('comments')
export class CommentConsumer {
  constructor(
    private ProductService: ProductsService,
    private commentService: CommentServices,
  ) {}

  @Process({
    name: 'updateStar',
    concurrency: 1, // allow one job to run at a time
  })
  async updateStar(job: Job<UpdateStarQueue>) {
    try {
      const { productId, starValue, type, preStarValue } = job.data;
      const product = await this.ProductService.getOneNoRelation(productId);
      if (!product) {
        throw new BadRequestException('Product not found');
      }
      switch (type) {
        case StarType.INCR:
          const [starIncr, countIncr] = this.commentService.incrementRating({
            count: product.count,
            star: product.star,
            starValue,
          });

          await this.ProductService.save({
            ...product,
            star: starIncr,
            count: countIncr,
          });
          break;
        case StarType.MODIFY:
          const [starModify, countModify] = this.commentService.modifyRating({
            count: product.count,
            star: product.star,
            prevStarValue: preStarValue,
            starValue,
          });
          await this.ProductService.save({
            ...product,
            star: starModify,
            count: countModify,
          });
          break;
        case StarType.DECR:
          const [starDecr, countDecr] = this.commentService.decrementRating({
            count: product.count,
            star: product.star,
            starValue,
          });
          await this.ProductService.save({
            ...product,
            star: starDecr,
            count: countDecr,
          });
          break;
      }
      return { message: 'ok' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
