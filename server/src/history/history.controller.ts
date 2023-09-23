import { Controller, Get, Param } from '@nestjs/common';
import { HistoriesServices } from './history.service';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { User } from '@/decorators/CurrentUser.decorator';
import { Users } from '@/entities';
import { GetParamDto } from './dto/getById.dto';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from '@/interceptors/serialize.interceptor';
import {
  GetHistoryByIdError_NotFound,
  GetHistoryByIdResponse,
  HistoryResponse,
} from './dto/getById-response.dto';
import { GetAllHistoriesResponse } from './dto/get-all-response.dto';
import { InternalServerError } from '@/errors/internal-server.error';

@ApiTags('Histories')
@ApiInternalServerErrorResponse({
  type: InternalServerError,
})
@Controller('histories')
export class HistoriesController {
  constructor(private historiesServices: HistoriesServices) {}

  @Get(':id')
  @AuthWithAccessToken()
  @Serialize(HistoryResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Get history by id' })
  @ApiOkResponse({ type: GetHistoryByIdResponse })
  @ApiBadRequestResponse({ type: GetHistoryByIdError_NotFound })
  getHistory(@User() user: Users, @Param() { id }: GetParamDto) {
    return this.historiesServices.getHistory({ id, userId: user.id });
  }

  @Get()
  @AuthWithAccessToken()
  @Serialize(HistoryResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Get histories' })
  @ApiOkResponse({ type: GetAllHistoriesResponse })
  getHistories(@User() user: Users) {
    return this.historiesServices.getHistories(user.id);
  }
}
