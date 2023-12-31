import { CartsServices } from '@/carts/carts.services';
import {
  ACTIVE_ROUTE,
  CHANGE_AVATAR_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  FOLLOW_ROUTE,
  FORGOT_ROUTE,
  INFO_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from '@/constant/user.constant';
import { Users, Carts, Followers } from '@/entities';
import { ImagesService } from '@/images/images.service';
import { IResponse } from '@/response/response';
import { generateCookieOpts } from '@/utils/generateCookieOpts';
import { generateHtml } from '@/utils/generateHtml';
import {
  HashService,
  JwtUtilsService,
  NodemailerService,
  RedisServices,
} from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import { ActiveDto } from './dto/active.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  FollowDto,
  FollowQueryDto,
  FollowStatus,
  FollowType,
} from './dto/follow.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InfoDto } from './dto/info.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignupDto } from './dto/sign-up.dto';
import { UserResponse } from './dto/user.response';
import {
  RefreshTokenPayload,
  RefreshTokenResponse,
} from './strategies/refresh-token.strategy';
import { AvatarDto } from './dto/avatar.dto';
import { ImageType } from '@/entities/enum';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Followers)
    private readonly followsRepository: Repository<Followers>,
    private readonly hashService: HashService,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly nodemailerService: NodemailerService,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => CartsServices))
    private readonly cartsServices: CartsServices,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisServices,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: {
      user: (alias: string) => this.usersRepository.createQueryBuilder(alias),
      follow: (alias: string) =>
        this.followsRepository.createQueryBuilder(alias),
    },
    startTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
  };

  // Auto generate access and refresh token
  private async generateAT_RT(user: Users | RefreshTokenPayload) {
    const accessTokenPromise = this.jwtUtilsService.generateToken(
      {
        id: user.id,
        username: user.username,
      },
      'access_token',
    );

    const refreshTokenPromise = this.jwtUtilsService.generateToken(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      'refresh_token',
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    const [accessTokenExpiresInMs, refreshTokenExpiresInMs] =
      this.jwtUtilsService.getMs(['access_token', 'refresh_token']);

    return [
      { value: accessToken, expiresIn: accessTokenExpiresInMs },
      { value: refreshToken, expiresIn: refreshTokenExpiresInMs },
    ];
  }

  private async updatePassword(user: Users, password: string) {
    user.password = await this.hashService.hash(password);
    await this.usersRepository.save(user);
    return user;
  }
  // ========== FOR ROUTE ==========

  async signup(data: SignupDto): Promise<IResponse<UserResponse>> {
    const { email, username, password } = data;

    // Check email has exist in database
    const currentUserWithEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (currentUserWithEmail) {
      if (!currentUserWithEmail.isActive) {
        throw new BadRequestException(SIGN_UP_ROUTE.ACTIVE_ACCOUNT);
      }
      throw new BadRequestException(SIGN_UP_ROUTE.EMAIL_EXIST);
    }

    // Check username has exist in database
    const currentUserWithUsername = await this.usersRepository.findOne({
      where: { username },
    });
    if (currentUserWithUsername) {
      throw new BadRequestException(SIGN_UP_ROUTE.USERNAME_EXIST);
    }

    // Hash password and store in db
    // hash password will be like this: ${HASH_PASSWORD}${JOIN_WITH}${SALT}
    // Ex: $argon2id$v=19.58123123123
    const hashPassword = await this.hashService.hash(password);
    const newUser = this.usersRepository.create({
      ...data,
      password: hashPassword,
      activeToken: randomBytes(32).toString('hex'),
    });
    await this.usersRepository.save(newUser);

    return {
      errCode: 0,
      message: SIGN_UP_ROUTE.SUCCESS,
      data: newUser,
    };
  }

  async active({ token }: ActiveDto) {
    const [userId, activeToken] = token.split('.');
    if (!userId || !activeToken) {
      throw new BadRequestException(ACTIVE_ROUTE.TOKEN_INVALID);
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId, activeToken },
    });

    if (!user) {
      throw new BadRequestException(ACTIVE_ROUTE.TOKEN_INVALID);
    }
    if (user.isActive) {
      throw new BadRequestException(ACTIVE_ROUTE.ACCOUNT_HAS_ALREADY_ACTIVATED);
    }
    const queryRunner = await this.helpers.startTransaction();
    try {
      // Init cart for user
      const newCart = this.cartsServices.helpers.create({ userId });

      user.isActive = true;
      user.activeToken = null;

      await queryRunner.manager.getRepository(Users).save(user);
      await queryRunner.manager.getRepository(Carts).save(newCart);
      await queryRunner.commitTransaction();
      return {
        errCode: 0,
        message: ACTIVE_ROUTE.SUCCESS,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(data: SignInDto, res: Response) {
    const { usernameOrEmail, password } = data;
    const user = await this.usersRepository.findOne({
      where: [
        { username: usernameOrEmail, isActive: true },
        { email: usernameOrEmail, isActive: true },
      ],
    });
    if (!user) {
      throw new BadRequestException(SIGN_IN_ROUTE.INCORRECT);
    }
    const isValidPassword = await this.hashService.verify(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(SIGN_IN_ROUTE.INCORRECT);
    }

    const [accessToken, refreshToken] = await this.generateAT_RT(user);

    res.cookie(
      'accessToken',
      accessToken.value,
      generateCookieOpts(accessToken.expiresIn),
    );

    res.cookie(
      'refreshToken',
      refreshToken.value,
      generateCookieOpts(refreshToken.expiresIn),
    );

    await this.cacheManager.set(
      `refreshToken:${user.id}`,
      refreshToken.value,
      refreshToken.expiresIn,
    );
    return {
      errCode: 0,
      message: SIGN_IN_ROUTE.SUCCESS,
      data: user,
    };
  }

  async signOut(res: Response, user: Users) {
    // set max age of cookies to 0
    res.cookie('accessToken', null, generateCookieOpts(0));
    res.cookie('refreshToken', null, generateCookieOpts(0));
    await this.cacheManager.del(`refreshToken:${user.id}`);
    await this.redisService.del(`refreshTokens:${user.id}`);
    return {
      errCode: 0,
      message: 'Sign out success!',
    };
  }

  async refreshToken(user: RefreshTokenResponse, res: Response) {
    const { rfToken, ...payload } = user;
    const [accessToken, refreshToken] = await this.generateAT_RT(
      payload as RefreshTokenPayload,
    );
    res.cookie(
      'accessToken',
      accessToken.value,
      generateCookieOpts(accessToken.expiresIn),
    );
    res.cookie(
      'refreshToken',
      refreshToken.value,
      generateCookieOpts(refreshToken.expiresIn),
    );

    await this.cacheManager.set(
      `refreshToken:${user.id}`,
      refreshToken.value,
      refreshToken.expiresIn,
    );
    await this.redisService.setAdd(`refreshTokens:${user.id}`, user.rfToken);
    return {
      errCode: 0,
      message: 'Refresh token success!',
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    const currentUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!currentUser) {
      return {
        errCode: 0,
        message: FORGOT_ROUTE.SUCCESS,
      };
    }
    // Check if already generate forgot token in database
    const forgotTokenKey = `user:forgotToken:${currentUser.id}`;
    const forgotTokenExists = await this.cacheManager.get(forgotTokenKey);
    if (forgotTokenExists) {
      return {
        errCode: 0,
        message: FORGOT_ROUTE.SUCCESS,
      };
    }

    const forgotToken = randomBytes(32).toString('hex');
    const forgotTokenHash = await this.hashService.hash(forgotToken);

    await this.cacheManager.set(
      forgotTokenKey,
      forgotTokenHash,
      1000 * 60 * 60,
    );

    this.nodemailerService.sendEmail({
      to: currentUser.email,
      subject: 'BanhTheCake - Forgot password',
      html: generateHtml({
        username: currentUser.username,
        linkToActive: `http://localhost:3000/reset-password?token=${forgotToken}&id=${currentUser.id}`,
        label: 'forgot',
      }),
    });
    return {
      errCode: 0,
      message: FORGOT_ROUTE.SUCCESS,
    };
  }

  async me(userId: string) {
    let user = null;
    const keyCache = `user:me:${userId}`;
    const cache = await this.cacheManager.get<Users>(keyCache);
    if (cache) {
      user = cache;
    } else {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      await this.cacheManager.set(keyCache, user);
    }
    return user;
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, password, userId } = data;
    const forgotTokenKey = `user:forgotToken:${userId}`;
    const existToken = await this.cacheManager.get<string>(forgotTokenKey);
    if (!existToken) {
      throw new BadRequestException(RESET_PASSWORD_ROUTE.INVALID_TOKEN);
    }
    const isValid = await this.hashService.verify(token, existToken);
    if (!isValid) {
      throw new BadRequestException(RESET_PASSWORD_ROUTE.INVALID_TOKEN);
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(RESET_PASSWORD_ROUTE.USER_NOT_FOUND);
    }
    await Promise.all([
      this.updatePassword(user, password),
      this.cacheManager.del(forgotTokenKey),
      this.cacheManager.del(`refreshToken:${userId}`),
    ]);
    return {
      errCode: 0,
      message: RESET_PASSWORD_ROUTE.SUCCESS,
    };
  }

  async changePassword(data: ChangePasswordDto, user: Users) {
    const { password, newPassword } = data;
    const currentUser = await this.usersRepository.findOne({
      where: { id: user.id, isActive: true },
    });
    if (!currentUser) {
      throw new BadRequestException(CHANGE_PASSWORD_ROUTE.USER_NOT_FOUND);
    }
    const isValidPassword = this.hashService.verify(
      password,
      currentUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException(CHANGE_PASSWORD_ROUTE.PASSWORD_INCORRECT);
    }
    await this.updatePassword(currentUser, newPassword);
    return {
      errCode: 0,
      message: CHANGE_PASSWORD_ROUTE.SUCCESS,
    };
  }

  async changeInfo(data: InfoDto, user: Users) {
    let updateUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!updateUser) {
      throw new BadRequestException(INFO_ROUTE.USER_NOT_FOUND);
    }
    updateUser = {
      ...updateUser,
      ...data,
    };
    await this.usersRepository.save(updateUser);
    await this.cacheManager.del(`user:me:${user.id}`);
    return {
      errCode: 0,
      message: INFO_ROUTE.SUCCESS,
      data: updateUser,
    };
  }

  async changeAvatar(data: AvatarDto, user: Users) {
    const queryRunner = await this.helpers.startTransaction();
    try {
      const { url, publicId } = data;
      const currentUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      if (!currentUser) {
        throw new BadRequestException(CHANGE_AVATAR_ROUTE.USER_NOT_FOUND);
      }
      const image = {
        url: url,
        publicKey: publicId,
        ownerId: currentUser.id,
      };
      const [imageEntity] = this.imagesService.helpers.create({
        key: 'user',
        data: [image],
      });
      currentUser.avatar = image.url;

      await queryRunner.manager.save(currentUser);
      await queryRunner.manager.save(imageEntity);

      await this.cacheManager.del(`user:me:${user.id}`);
      await queryRunner.commitTransaction();

      return {
        errCode: 0,
        message: CHANGE_AVATAR_ROUTE.SUCCESS,
        data: currentUser,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async follow(data: FollowDto, userId: string) {
    const { followingId, type } = data;
    let typeReturn = '';
    if (userId === followingId) {
      throw new BadRequestException(FOLLOW_ROUTE.YOURSELF);
    }
    const isExist = await this.usersRepository.findOne({
      where: { id: followingId },
    });
    if (!isExist) {
      throw new BadRequestException(FOLLOW_ROUTE.USER_NOT_FOUND);
    }
    switch (type) {
      case FollowType.FOLLOW:
        const isFollowing = await this.followsRepository.findOne({
          where: { userId, followingId },
        });
        if (isFollowing) {
          throw new BadRequestException(FOLLOW_ROUTE.ALREADY_FOLLOW);
        }
        await this.followsRepository.save({
          userId,
          followingId,
        });
        typeReturn = 'Follow';
        break;
      case FollowType.UN_FOLLOW:
        const followerEntity = await this.followsRepository.findOne({
          where: { userId, followingId },
        });
        if (followerEntity) {
          await this.followsRepository.remove(followerEntity);
        }
        typeReturn = 'Unfollow';
        break;
      default:
        throw new BadRequestException('Wrong type of follow!');
    }
    return {
      errCode: 0,
      message: FOLLOW_ROUTE.SUCCESS(typeReturn),
    };
  }

  async getFollow(userId: string, query: FollowQueryDto) {
    const { cursor, limit = 4, type = FollowStatus.FOLLOWER } = query;
    let followQueryBuilder =
      this.followsRepository.createQueryBuilder('follow');
    let total = 0;
    switch (type) {
      case FollowStatus.FOLLOWER:
        total = await this.followsRepository.count({
          where: { followingId: userId },
        });
        followQueryBuilder = followQueryBuilder
          .leftJoinAndSelect('follow.follower', 'follower')
          .where('follow.followingId = :id', { id: userId });
        break;
      case FollowStatus.FOLLOWING:
        total = await this.followsRepository.count({
          where: { userId: userId },
        });
        followQueryBuilder = followQueryBuilder
          .leftJoinAndSelect('follow.following', 'following')
          .where('follow.userId = :id', { id: userId });
        break;
      default:
        throw new BadRequestException('Wrong type of follow!');
    }
    const follows = await followQueryBuilder
      .andWhere('follow.created_at < :cursor', {
        cursor: cursor ? new Date(cursor) : new Date(),
      })
      .take(limit)
      .orderBy('follow.created_at', 'DESC')
      .getMany();
    const result = follows.map((item) => {
      if (type === FollowStatus.FOLLOWER) {
        return item.follower;
      }
      return item.following;
    });
    const lastItem = follows[follows.length - 1];
    let next = null;
    if (lastItem) {
      next = new Date(lastItem.created_at).getTime();
    }
    return {
      limit,
      next,
      total,
      data: result,
    };
  }
}
