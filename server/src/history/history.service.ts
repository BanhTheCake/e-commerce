import {
  GET_ALL_HISTORY_ROUTE,
  GET_BY_ID_HISTORY_ROUTE,
} from '@/constant/history.constant';
import { Histories, ProductHistories } from '@/entities';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class HistoriesServices {
  constructor(
    @InjectRepository(Histories)
    private historiesRepository: Repository<Histories>,
    @InjectRepository(ProductHistories)
    private productHistoriesRepository: Repository<ProductHistories>,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: {
      history: (alias: string) =>
        this.historiesRepository.createQueryBuilder(alias),
      productHistory: (alias: string) =>
        this.productHistoriesRepository.createQueryBuilder(alias),
    },
    startTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
  };

  // ========= FOR ROUTE ==========

  async getHistories(userId: string) {
    const histories = await this.historiesRepository.find({
      where: { userId },
    });
    return {
      errCode: 0,
      message: GET_ALL_HISTORY_ROUTE.SUCCESS,
      data: histories,
    };
  }

  async getHistory({ id, userId }: { id: string; userId: string }) {
    const history = await this.historiesRepository.findOne({
      where: { id, userId },
      relations: {
        productHistories: {
          product: true,
        },
      },
    });
    if (!history) {
      throw new BadRequestException(GET_BY_ID_HISTORY_ROUTE.NOT_FOUND(id));
    }
    return {
      errCode: 0,
      message: GET_BY_ID_HISTORY_ROUTE.SUCCESS,
      data: history,
    };
  }
}
