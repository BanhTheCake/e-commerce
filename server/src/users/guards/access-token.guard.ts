import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function AuthWithAccessToken() {
  return UseGuards(AccessTokenGuard);
}

@Injectable()
export class AccessTokenGuard extends AuthGuard('access-token') {}
