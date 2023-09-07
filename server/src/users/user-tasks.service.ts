import { Tokens } from '@/entities';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UserTasksService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}
  // Delete forgot token expired every 5 minute
  @Cron('*/5 * * * *') // every 5 minute
  async autoDeleteExpiredToken() {
    try {
      console.log('AUTO DELETE TOKEN EXPIRED');
      const tokens = await this.tokensRepository.find({
        where: { expiredIn: LessThanOrEqual(new Date()) },
      });
      await this.tokensRepository.remove(tokens);
    } catch (error) {
      console.log(error);
    }
  }
}
