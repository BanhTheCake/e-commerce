import {
  GET_ALL_HISTORY_ROUTE,
  GET_BY_ID_HISTORY_ROUTE,
} from '@/constant/history.constant';
import { Histories } from '@/entities/history.entity';
import { ProductHistories } from '@/entities/productHistory.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriesServices {
  constructor(
    @InjectRepository(Histories)
    private historiesRepository: Repository<Histories>,
    @InjectRepository(ProductHistories)
    private productHistoriesRepository: Repository<ProductHistories>,
  ) {}

  async getHistories(userId: string) {
    try {
      const histories = await this.historiesRepository.find({
        where: { userId },
      });
      return {
        errCode: 0,
        message: GET_ALL_HISTORY_ROUTE.SUCCESS,
        data: histories,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async getHistory({ id, userId }: { id: string; userId: string }) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
