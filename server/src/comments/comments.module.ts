import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { Comments } from '@/entities/comment.entity';
import { DatabaseModule } from '@app/shared';
import { CommentServices } from './comments.service';
import { ProductsModule } from '@/products/products.module';
import { BullModule } from '@nestjs/bull';
import { CommentConsumer } from './comments.consumer';

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
