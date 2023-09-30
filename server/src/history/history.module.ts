import { Histories, ProductHistories } from '@/entities';
import { DatabaseModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { HistoriesController } from './history.controller';
import { HistoriesServices } from './history.service';

@Module({
  imports: [DatabaseModule.forFeature([Histories, ProductHistories])],
  controllers: [HistoriesController],
  providers: [HistoriesServices],
  exports: [HistoriesServices],
})
export class HistoriesModule {}
