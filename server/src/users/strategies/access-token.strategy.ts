import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(configService: ConfigService, private userService: UsersService) {
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

  async validate(payload: any) {
    const user = await this.userService.helpers.createQueryBuilder
      .user('user')
      .where('user.id = :id', { id: payload.id })
      .getOne();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
