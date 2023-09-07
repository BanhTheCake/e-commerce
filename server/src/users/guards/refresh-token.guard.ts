import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function AuthWithRefreshToken() {
  return UseGuards(RefreshTokenGuard);
}

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {}
