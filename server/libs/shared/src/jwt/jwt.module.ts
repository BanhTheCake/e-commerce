import { ConfigService } from '@nestjs/config';
import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtilsService } from './jwt.service';
import { JWT_TOKEN_VALUE } from './jwt.constant';
import { IJwtKeyValue } from './jwt.interface';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [JwtUtilsService],
  exports: [JwtUtilsService],
})
export class JwtUtilsModule {
  public static register(): DynamicModule {
    return {
      module: JwtUtilsModule,
      providers: [
        {
          provide: JWT_TOKEN_VALUE,
          useFactory: (configService: ConfigService): IJwtKeyValue => {
            return {
              access_token:
                configService.getOrThrow<string>('JWT_ACCESS_TOKEN'),
              access_token_expires_in: configService.getOrThrow<string>(
                'JWT_ACCESS_TOKEN_EXPIRES_IN',
              ),
              refresh_token:
                configService.getOrThrow<string>('JWT_REFRESH_TOKEN'),
              refresh_token_expires_in: configService.getOrThrow<string>(
                'JWT_REFRESH_TOKEN_EXPIRES_IN',
              ),
              active_token:
                configService.getOrThrow<string>('JWT_ACTIVE_TOKEN'),
              active_token_expires_in: configService.getOrThrow<string>(
                'JWT_ACTIVE_TOKEN_EXPIRES_IN',
              ),
              forgot_password_token: configService.getOrThrow<string>(
                'JWT_FORGOT_PASSWORD_TOKEN',
              ),
              forgot_password_token_expires_in:
                configService.getOrThrow<string>(
                  'JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN',
                ),
            };
          },
          inject: [ConfigService],
        },
      ],
    };
  }
}
