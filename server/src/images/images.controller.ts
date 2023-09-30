import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './validate/image.options';
import { UploadFileRequired } from '@/decorators/image.decorator';
import { AuthWithAccessToken } from '@/users/guards/access-token.guard';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { PreloadDto } from './dto/preload.dto';
import {
  PreloadError_Failed,
  PreloadError_InvalidType,
  PreloadResponse,
} from './dto/preload-response.dto';

@Controller('images')
export class ImagesController {
  constructor(private imageService: ImagesService) {}

  @Post('/preload')
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Preload image (expired in 30 minutes)' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: PreloadResponse,
  })
  @ApiBadRequestResponse({
    type: PreloadError_Failed,
  })
  @ApiUnsupportedMediaTypeResponse({
    type: PreloadError_InvalidType,
  })
  @UseInterceptors(FileInterceptor('file', imageOptions))
  upload(
    @UploadFileRequired() file: Express.Multer.File,
    @Body() _: PreloadDto,
  ) {
    return this.imageService.upload(file);
  }
}
