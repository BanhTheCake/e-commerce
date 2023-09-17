import { Comments } from '@/entities/comment.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, IsNull, LessThan } from 'typeorm';
import { CommentType, CreateDto } from './dto/create.dto';
import { Products, Users } from '@/entities';
import { ProductsService } from '@/products/products.service';
import { GetQueryDto } from './dto/get.dto';
import { paginationFn } from '@/utils/pagination';
import { UpdateDto } from './dto/update.dto';
import { GetReplyQueryDto } from './dto/get-reply.dto';
import { isEmpty } from 'lodash';
import {
  CREATE_COMMENT_ROUTE,
  DELETE_COMMENT_ROUTE,
  GET_REPLY_ROUTE,
  UPDATE_COMMENT_ROUTE,
} from '@/constant/comment.constant';

@Injectable()
export class CommentServices {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    private productServices: ProductsService,
    private dataSource: DataSource,
  ) {}

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  decrementRating({
    count,
    star,
    starValue,
  }: {
    count: number;
    star: number;
    starValue: number;
  }) {
    const starResult = (star * count - starValue) / (count - 1);
    const countResult = count - 1;
    return [starResult, countResult];
  }

  incrementRating({
    count,
    star,
    starValue,
  }: {
    count: number;
    star: number;
    starValue: number;
  }) {
    const countResult = count + 1;
    const starResult = star + (starValue - star) / countResult;
    return [starResult, countResult];
  }

  modifyRating({
    count,
    star,
    prevStarValue,
    starValue,
  }: {
    count: number;
    star: number;
    starValue: number;
    prevStarValue: number;
  }) {
    const [starDecrement, countDecrement] = this.decrementRating({
      count: count,
      star: star,
      starValue: prevStarValue,
    });
    const [starIncrement, countIncrement] = this.incrementRating({
      count: countDecrement,
      star: starDecrement,
      starValue,
    });
    return [starIncrement, countIncrement];
  }

  async create(user: Users, data: CreateDto) {
    try {
      const { replyId, productId, type = CommentType.CREATE, starValue } = data;
      let product = await this.productServices.getOneNoRelation(productId);
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
      const queryRunner = await this.startTransaction();
      try {
        if (type === CommentType.CREATE) {
          const [star, count] = this.incrementRating({
            count: product.count,
            star: product.star,
            starValue,
          });
          product = {
            ...product,
            star,
            count,
          };
          await queryRunner.manager.getRepository(Products).save(product);
        }
        const rs = await queryRunner.manager.save(commentEntity);
        await queryRunner.commitTransaction();
        return {
          errCode: 0,
          message: CREATE_COMMENT_ROUTE.SUCCESS,
          data: rs,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async update(id: string, data: UpdateDto, userId: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id, userId },
      });
      if (!comment) {
        throw new BadRequestException(UPDATE_COMMENT_ROUTE.NOT_FOUND);
      }
      const { starValue, content } = data;
      if (content) {
        comment.content = content;
      }
      const queryRunner = await this.startTransaction();
      try {
        if (!comment.replyId && starValue && comment.starValue !== starValue) {
          const product = await this.productServices.getOneNoRelation(
            comment.productId,
          );
          if (!product) {
            throw new BadRequestException(
              UPDATE_COMMENT_ROUTE.NOT_FOUND_PRODUCT,
            );
          }
          const [star, count] = this.modifyRating({
            count: product.count,
            star: product.star,
            starValue,
            prevStarValue: comment.starValue,
          });
          comment.starValue = starValue;
          await queryRunner.manager.getRepository(Products).save({
            ...product,
            star,
            count,
          });
        }
        await queryRunner.manager.getRepository(Comments).save(comment);
        await queryRunner.commitTransaction();
        return {
          errCode: 0,
          message: UPDATE_COMMENT_ROUTE.SUCCESS,
          data: comment,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async delete(id: string, userId: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id, userId },
      });
      if (!comment) {
        throw new BadRequestException(DELETE_COMMENT_ROUTE.NOT_FOUND);
      }
      const product = await this.productServices.getOneNoRelation(
        comment.productId,
      );
      if (!product) {
        throw new BadRequestException(DELETE_COMMENT_ROUTE.NOT_FOUND_PRODUCT);
      }
      const queryRunner = await this.startTransaction();
      try {
        if (!comment.replyId) {
          const [star, count] = this.decrementRating({
            count: product.count,
            star: product.star,
            starValue: comment.starValue,
          });
          await queryRunner.manager.getRepository(Products).save({
            ...product,
            star,
            count,
          });
        }
        await queryRunner.manager.remove(comment);
        await queryRunner.commitTransaction();
        return {
          errCode: 0,
          message: DELETE_COMMENT_ROUTE.SUCCESS,
          data: comment,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async getReply(data: GetReplyQueryDto, commentId: string) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async getAll(data: GetQueryDto, productId: string) {
    try {
      const { limit = 4, page = 1, limitReply = 2 } = data;
      const offset = limit * (page - 1);
      const [comments, totalComments] =
        await this.commentRepository.findAndCount({
          where: { productId, replyId: IsNull() },
          relations: {
            // user: true,
          },
          take: limit,
          skip: offset,
          order: {
            created_at: 'DESC',
          },
        });
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
