import { Module, DynamicModule, Global } from '@nestjs/common';
import { HashService } from './hash.service';
import { HashOptions } from './hash.interface';
import { HASH_OPTIONS } from './hash.constant';

@Global()
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {
  public static register({
    saltLength = 8,
    joinWith = '.',
  }: HashOptions): DynamicModule {
    return {
      module: HashModule,
      providers: [
        { provide: HASH_OPTIONS, useValue: { saltLength, joinWith } },
      ],
    };
  }
}
