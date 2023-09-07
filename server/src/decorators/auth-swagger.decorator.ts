import { UnauthorizedError } from '@/errors/unauthorize.error';
import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiAuth = () => {
  return applyDecorators(
    ApiCookieAuth(),
    ApiUnauthorizedResponse({
      type: UnauthorizedError,
      description: 'You need to login!',
    }),
  );
};
