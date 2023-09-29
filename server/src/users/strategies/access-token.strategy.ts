import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users.service';
import { Cache } from 'cache-manager';

export interface AccessTokenPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.getTokenFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),
    });
  }

  public static getTokenFromCookies(req: Request) {
    const cookies = req.cookies || {};
    return cookies.accessToken;
  }

  async validate(payload: AccessTokenPayload) {
    const isLogin = await this.cacheManager.get(`refreshToken:${payload.id}`);
    if (!isLogin) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
