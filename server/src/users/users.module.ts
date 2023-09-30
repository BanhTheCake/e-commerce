import { CartsModule } from '@/carts/carts.module';
import { Followers, Users } from '@/entities';
import { ImagesModule } from '@/images/images.module';
import {
  DatabaseModule,
  HashModule,
  JwtUtilsModule,
  NodemailerModule,
} from '@app/shared';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserSubscriber } from './user.subscriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ActiveTokenValidator } from './validators/active-token.validator';

@Module({
  imports: [
    DatabaseModule.forFeature([Users, Followers]),
    HashModule.register({
      joinWith: '.',
      saltLength: 8,
    }),
    JwtUtilsModule.register(),
    NodemailerModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          clientId: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
          clientSecret: configService.getOrThrow<string>(
            'GOOGLE_CLIENT_SERCET',
          ),
          refresh_token: configService.getOrThrow<string>(
            'GOOGLE_REFRESH_TOKEN',
          ),
          user: configService.getOrThrow<string>('USER_GMAIL'),
        };
      },
      inject: [ConfigService],
    }),
    ImagesModule,
    forwardRef(() => CartsModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSubscriber,
    ActiveTokenValidator,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
