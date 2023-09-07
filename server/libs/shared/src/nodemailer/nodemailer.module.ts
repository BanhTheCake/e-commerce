import { DynamicModule, Module, Global } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { NODEMAILER_TOKEN_OPTS } from './nodemailer.constant';
import { NodemailerAsyncOptions } from './nodemailer.interface';

@Global()
@Module({
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {
  public static registerAsync(opts: NodemailerAsyncOptions): DynamicModule {
    return {
      module: NodemailerModule,
      providers: [
        {
          provide: NODEMAILER_TOKEN_OPTS,
          useFactory: opts.useFactory,
          inject: opts.inject || [],
        },
      ],
    };
  }
}
