import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_TOKEN_VALUE } from './jwt.constant';
import { IJwtKeyValue, JwtType } from './jwt.interface';
import ms from 'ms';

@Injectable()
export class JwtUtilsService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(JWT_TOKEN_VALUE) private readonly tokenValue: IJwtKeyValue,
  ) {}

  async generateToken(payload: any, type: JwtType) {
    const secret = this.tokenValue[type];
    const expires_in = this.tokenValue[type + '_expires_in'];
    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expires_in,
    });
    return token;
  }

  getMillisecondsToken(type: JwtType) {
    return ms(this.tokenValue[type + '_expires_in']);
  }

  getMs(arrType: JwtType[]): number[] {
    const arrMs = [];
    for (const type of arrType) {
      arrMs.push(ms(this.tokenValue[type + '_expires_in']));
    }
    return arrMs;
  }
}
