import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users.service';
import { UserRoles } from '@/entities/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisServices } from '@app/shared';

export interface RefreshTokenPayload {
  id: string;
  username: string;
  role: UserRoles;
  iat: number;
  exp: number;
}

export type RefreshTokenResponse = RefreshTokenPayload & {
  rfToken: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisServices,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.getTokenFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN'),
      passReqToCallback: true,
    });
  }

  public static getTokenFromCookies(req: Request) {
    const cookies = req.cookies || {};
    return cookies.refreshToken;
  }

  async validate(req: Request, payload: RefreshTokenPayload) {
    const rfToken = req.cookies.refreshToken;
    const isExistInRedis = await this.cacheManager.get(
      `refreshToken:${payload.id}`,
    );
    if (!isExistInRedis) {
      throw new UnauthorizedException();
    }
    const isInBlackList = await this.redisService.setIsMember(
      `refreshTokens:${payload.id}`,
      rfToken,
    );
    if (isInBlackList) {
      await this.cacheManager.del(`refreshToken:${payload.id}`);
      throw new UnauthorizedException();
    }
    return { ...payload, rfToken };
  }
}
