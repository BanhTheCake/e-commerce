import { Module } from '@nestjs/common';
import { HistoriesController } from './history.controller';
import { HistoriesServices } from './history.service';
import { DatabaseModule } from '@app/shared';
import { ProductHistories } from '@/entities/productHistory.entity';
import { Histories } from '@/entities/history.entity';

@Module({
  imports: [DatabaseModule.forFeature([Histories, ProductHistories])],
  controllers: [HistoriesController],
  providers: [HistoriesServices],
  exports: [HistoriesServices],
})
export class HistoriesModule {}
