import {
  DatabaseModule,
  HashModule,
  JwtUtilsModule,
  NodemailerModule,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { UserSubscriber } from './user.subscriber';
import { ActiveTokenValidator } from './validators/active-token.validator';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { Tokens, Users } from '@/entities';
import { UserTasksService } from './user-tasks.service';
import { ImagesModule } from '@/images/images.module';
import { Followers } from '@/entities/follower.entity';
import { CartsModule } from '@/carts/carts.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Users, Tokens, Followers]),
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
    CartsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSubscriber,
    ActiveTokenValidator,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UserTasksService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
