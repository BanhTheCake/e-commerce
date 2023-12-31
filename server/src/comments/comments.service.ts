import { Comments, Users } from '@/entities';
import { ProductsService } from '@/products/products.service';
import { paginationFn } from '@/utils/pagination';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, LessThan, Repository } from 'typeorm';
import { CommentType, CreateDto } from './dto/create.dto';
import { GetReplyQueryDto } from './dto/get-reply.dto';
import { GetQueryDto } from './dto/get.dto';
import { UpdateDto } from './dto/update.dto';

import {
  CREATE_COMMENT_ROUTE,
  DELETE_COMMENT_ROUTE,
  GET_REPLY_ROUTE,
  UPDATE_COMMENT_ROUTE,
} from '@/constant/comment.constant';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { StarType, UpdateStarQueue } from './queue/update-star.queue';

interface IHelperRating<T> {
  count: number;
  star: number;
  starValue: number;
  prevStarValue?: T;
}

@Injectable()
export class CommentServices {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectQueue('comments') private readonly commentQueue: Queue,
    private productServices: ProductsService,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: (alias: string) =>
      this.commentRepository.createQueryBuilder(alias),
    startTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
    rating: {
      decr: ({ count, star, starValue }: IHelperRating<never>) => {
        const starResult = (star * count - starValue) / (count - 1);
        const countResult = count - 1;
        return [starResult, countResult];
      },
      incr: ({ count, star, starValue }: IHelperRating<never>) => {
        const countResult = count + 1;
        const starResult = star + (starValue - star) / countResult;
        return [starResult, countResult];
      },
      modify: ({
        count,
        star,
        prevStarValue,
        starValue,
      }: IHelperRating<number>) => {
        const [starDecrement, countDecrement] = this.helpers.rating.decr({
          count: count,
          star: star,
          starValue: prevStarValue,
        });
        const [starIncrement, countIncrement] = this.helpers.rating.incr({
          count: countDecrement,
          star: starDecrement,
          starValue,
        });
        return [starIncrement, countIncrement];
      },
    },
  };

  // ========= FOR ROUTE ==========

  async create(user: Users, data: CreateDto) {
    const { replyId, productId, type = CommentType.CREATE, starValue } = data;
    const product = await this.productServices.helpers.createQueryBuilder
      .product('product')
      .where('product.id = :id', { id: productId })
      .getOne();
    if (!product) {
      throw new BadRequestException(CREATE_COMMENT_ROUTE.NOT_FOUND_PRODUCT);
    }
    let commentEntity: Comments;
    switch (type) {
      case CommentType.CREATE:
        commentEntity = this.commentRepository.create({
          ...data,
          userId: user.id,
          replyId: null,
        });
        await this.commentQueue.add(
          'updateStar',
          new UpdateStarQueue(StarType.INCR, productId, starValue),
        );
        break;
      case CommentType.REPLY:
        commentEntity = this.commentRepository.create({
          ...data,
          replyId,
          userId: user.id,
          starValue: null,
        });
        break;
      default:
        throw new BadRequestException(CREATE_COMMENT_ROUTE.INVALID_TYPE);
    }
    const rs = await this.commentRepository.save(commentEntity);
    return {
      errCode: 0,
      message: CREATE_COMMENT_ROUTE.SUCCESS,
      data: rs,
    };
  }

  async update(id: string, data: UpdateDto, userId: string) {
    const { starValue, content } = data;
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });
    if (!comment) {
      throw new BadRequestException(UPDATE_COMMENT_ROUTE.NOT_FOUND);
    }
    if (content) {
      comment.content = content;
    }
    if (!comment.replyId && starValue && comment.starValue !== starValue) {
      await this.commentQueue.add(
        'updateStar',
        new UpdateStarQueue(
          StarType.MODIFY,
          comment.productId,
          starValue,
          comment.starValue,
        ),
      );
      comment.starValue = starValue;
    }
    await this.commentRepository.save(comment);
    return {
      errCode: 0,
      message: UPDATE_COMMENT_ROUTE.SUCCESS,
      data: comment,
    };
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });
    if (!comment) {
      throw new BadRequestException(DELETE_COMMENT_ROUTE.NOT_FOUND);
    }
    if (!comment.replyId) {
      await this.commentQueue.add(
        'updateStar',
        new UpdateStarQueue(
          StarType.DECR,
          comment.productId,
          comment.starValue,
        ),
      );
    }
    await this.commentRepository.remove(comment);
    return {
      errCode: 0,
      message: DELETE_COMMENT_ROUTE.SUCCESS,
      data: comment,
    };
  }

  async getReply(data: GetReplyQueryDto, commentId: string) {
    const { limit = 4, cursor } = data;
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new BadRequestException(GET_REPLY_ROUTE.NOT_FOUND);
    }
    const totalCount = await this.commentRepository.count({
      where: { replyId: commentId },
    });
    const replyComments = await this.commentRepository.find({
      where: {
        replyId: commentId,
        created_at: LessThan(cursor ? new Date(cursor) : new Date()),
      },
      relations: {
        // user: true,
      },
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
    const lastComment = replyComments[replyComments.length - 1];
    let nextCursor = null;
    if (lastComment) {
      nextCursor = new Date(lastComment.created_at).getTime();
    }
    return {
      limit,
      total: totalCount,
      next: nextCursor,
      commentId,
      data: replyComments,
    };
  }

  async getAll(data: GetQueryDto, productId: string) {
    const { limit = 4, page = 1, limitReply = 2 } = data;
    const offset = limit * (page - 1);
    const [comments, totalComments] = await this.commentRepository.findAndCount(
      {
        where: { productId, replyId: IsNull() },
        relations: {
          // user: true,
        },
        take: limit,
        skip: offset,
        order: {
          created_at: 'DESC',
        },
      },
    );
    const commentsResultPromise = comments.map(async (comment) => {
      const replies = await this.getReply({ limit: limitReply }, comment.id);
      return { comment, replies };
    });
    const rs = await Promise.all(commentsResultPromise);
    const pagination = paginationFn({ limit, page, total: totalComments });
    return {
      ...pagination,
      data: rs,
    };
  }
}
