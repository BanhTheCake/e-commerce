import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = 'Something wrong with server !';
    let code = 'InternalServerErrorException';
    let detail = null;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as any).response.message;
        code = (exception as any).constructor.name;
        break;
      case exception instanceof QueryFailedError: // this is a TypeOrm error
        code = (exception as any).code;
        message = (exception as any).message;
        detail = (exception as any).detail;
        if (code === '23505') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Fields already exist!';
        } else {
          console.log(exception);
        }
        break;
      case exception instanceof EntityNotFoundError: // this is another TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        detail = (exception as any).detail;
        break;
      case exception instanceof CannotCreateEntityIdMapError: // and another
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        code = (exception as any).code;
        detail = (exception as any).detail;
        break;
      default:
        console.log(exception);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message,
      code,
      detail,
    });
  }
}
