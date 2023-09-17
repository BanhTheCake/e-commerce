import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { Comments } from '@/entities/comment.entity';
import { DatabaseModule } from '@app/shared';
import { CommentServices } from './comments.service';
import { ProductsModule } from '@/products/products.module';

@Module({
  imports: [DatabaseModule.forFeature([Comments]), ProductsModule],
  controllers: [CommentsController],
  providers: [CommentServices],
  exports: [CommentServices],
})
export class CommentsModule {}
