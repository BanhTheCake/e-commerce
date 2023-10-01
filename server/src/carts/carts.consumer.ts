import { CartsServices } from '@/carts/carts.services';
import { Histories, ProductHistories } from '@/entities';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('carts')
export class CartsConsumer {
  constructor(private cartsServices: CartsServices) {}

  @Process({
    name: 'history',
    concurrency: 5,
  })
  async createHistory(job: Job<any>) {
    const { userId, total, historyItems } = job.data;
    const queryRunner = await this.cartsServices.helpers.startTransaction();
    try {
      const historyRepository = queryRunner.manager.getRepository(Histories);
      const historyItemRepository =
        queryRunner.manager.getRepository(ProductHistories);
      const history = historyRepository.create({
        userId: userId,
        total: total,
      });
      await historyRepository.save(history);
      const productHistory = historyItems.map((item) => {
        return historyItemRepository.create({
          ...item,
          historyId: history.id,
        });
      });
      await historyItemRepository.save(productHistory);
      await queryRunner.commitTransaction();
      return { message: 'Ok' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
