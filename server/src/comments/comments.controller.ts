import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentServices } from './comments.service';
import { CommentType, CreateDto } from './dto/create.dto';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { GetParamDto, GetQueryDto } from './dto/get.dto';
import { DeleteParamDto } from './dto/delete.dto';
import { UpdateDto, UpdateParamDto } from './dto/update.dto';
import { GetReplyParamDto, GetReplyQueryDto } from './dto/get-reply.dto';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import { InternalServerError } from '@/errors/internal-server.error';
import { CommentResponse } from './dto/comment.response';
import {
  CreateCommentError_InvalidType,
  CreateCommentError_NotFoundProduct,
  CreateCommentResponse,
} from './dto/create-reponse.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import {
  DeleteCommentError_NotFound,
  DeleteCommentError_NotFoundProduct,
  DeleteCommentResponse,
} from './dto/delete-response.dto';
import {
  UpdateCommentError_NotFound,
  UpdateCommentError_NotFoundProduct,
  UpdateCommentResponse,
} from './dto/update-response.dto';
import {
  GetReplyError_NotFound,
  GetReplyResponse,
} from './dto/get-reply-response.dto';
import { GetAllCommentsData, GetAllResponse } from './dto/get-response.dto';

@ApiTags('Comments')
@Controller('comments')
@ApiInternalServerErrorResponse({
  type: InternalServerError,
})
export class CommentsController {
  constructor(private commentsService: CommentServices) {}

  @Post()
  @AuthWithAccessToken()
  @Serialize(CommentResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Create comment' })
  @ApiExtraModels(
    CreateCommentError_NotFoundProduct,
    CreateCommentError_InvalidType,
  )
  @ApiOkResponse({ type: CreateCommentResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        CreateCommentError_NotFoundProduct,
        CreateCommentError_InvalidType,
      ),
    },
  })
  createComment(@Body() data: CreateDto, @User() user: Users) {
    return this.commentsService.create(user, data);
  }

  @Delete(':id')
  @AuthWithAccessToken()
  @Serialize(CommentResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Delete comment with id' })
  @ApiExtraModels(
    DeleteCommentError_NotFound,
    DeleteCommentError_NotFoundProduct,
  )
  @ApiOkResponse({ type: DeleteCommentResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        DeleteCommentError_NotFound,
        DeleteCommentError_NotFoundProduct,
      ),
    },
  })
  deleteComment(@Param() { id }: DeleteParamDto, @User() user: Users) {
    return this.commentsService.delete(id, user.id);
  }

  @Patch(':id')
  @AuthWithAccessToken()
  @Serialize(CommentResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Update comment with id' })
  @ApiExtraModels(
    UpdateCommentError_NotFound,
    UpdateCommentError_NotFoundProduct,
  )
  @ApiOkResponse({ type: UpdateCommentResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        UpdateCommentError_NotFound,
        UpdateCommentError_NotFoundProduct,
      ),
    },
  })
  updateComment(
    @Param() { id }: UpdateParamDto,
    @Body() data: UpdateDto,
    @User() user: Users,
  ) {
    return this.commentsService.update(id, data, user.id);
  }

  @Get('/reply/:commentId')
  @Serialize(CommentResponse)
  @ApiOperation({ summary: 'Get reply comment with id' })
  @ApiOkResponse({ type: GetReplyResponse })
  @ApiBadRequestResponse({
    type: GetReplyError_NotFound,
  })
  getReplyComments(
    @Query() data: GetReplyQueryDto,
    @Param() { commentId }: GetReplyParamDto,
  ) {
    return this.commentsService.getReply(data, commentId);
  }

  @Get(':productId')
  @Serialize(GetAllCommentsData)
  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ type: GetAllResponse })
  getAllComments(
    @Query() data: GetQueryDto,
    @Param() { productId }: GetParamDto,
  ) {
    return this.commentsService.getAll(data, productId);
  }
}
