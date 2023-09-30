import { Comments } from '@/entities';
import { ProductsModule } from '@/products/products.module';
import { DatabaseModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CommentConsumer } from './comments.consumer';
import { CommentsController } from './comments.controller';
import { CommentServices } from './comments.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Comments]),
    BullModule.registerQueue({
      name: 'comments',
    }),
    ProductsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentServices, CommentConsumer],
  exports: [CommentServices],
})
export class CommentsModule {}
