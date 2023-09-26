import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
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

  async validate(req: Request) {
    const rfToken = req.cookies['refreshToken'];
    const user = await this.userService.helpers.createQueryBuilder
      .user('user')
      .where('user.rfToken = :rfToken', { rfToken })
      .getOne();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
