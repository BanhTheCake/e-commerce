import {
  Injectable,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, MoreThan, Repository } from 'typeorm';
import { SignupDto } from './dto/sign-up.dto';
import { HashService, JwtUtilsService, NodemailerService } from '@app/shared';
import { UserResponse } from './dto/user.response';
import { IResponse } from '@/response/response';
import { randomBytes } from 'crypto';
import { ActiveDto } from './dto/active.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { generateCookieOpts } from '@/utils/generateCookieOpts';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Tokens, Users } from '@/entities';
import { generateHtml } from '@/utils/generateHtml';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InfoDto } from './dto/info.dto';
import { ImagesService } from '@/images/images.service';
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
import {
  FollowDto,
  FollowQueryDto,
  FollowType,
  FollowStatus,
} from './dto/follow.dto';
import { Followers } from '@/entities/follower.entity';
import { CartsServices } from '@/carts/carts.services';
import { Carts } from '@/entities/cart.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
    @InjectRepository(Followers)
    private readonly followsRepository: Repository<Followers>,
    private readonly hashService: HashService,
    private readonly jwtUtilsService: JwtUtilsService,
    private readonly nodemailerService: NodemailerService,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => CartsServices))
    private readonly cartsServices: CartsServices,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: {
      user: (alias: string) => this.usersRepository.createQueryBuilder(alias),
      token: (alias: string) => this.tokensRepository.createQueryBuilder(alias),
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
  private async generateAT_RT(user: Users) {
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
    user.rfToken = null;
    await this.usersRepository.save(user);
    return user;
  }

  async signup(data: SignupDto): Promise<IResponse<UserResponse>> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  // ========== FOR ROUTE ==========

  async active({ token }: ActiveDto) {
    try {
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
        throw new BadRequestException(
          ACTIVE_ROUTE.ACCOUNT_HAS_ALREADY_ACTIVATED,
        );
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async signIn(data: SignInDto, res: Response) {
    try {
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

      user.rfToken = refreshToken.value;
      await this.usersRepository.save(user);
      return {
        errCode: 0,
        message: SIGN_IN_ROUTE.SUCCESS,
        data: user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async signOut(res: Response, user: Users) {
    try {
      const currentUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      if (!currentUser) {
        throw new BadRequestException();
      }

      currentUser.rfToken = null;
      // set max age of cookies to 0
      res.cookie('accessToken', null, generateCookieOpts(0));
      res.cookie('refreshToken', null, generateCookieOpts(0));

      await this.usersRepository.save(currentUser);

      return {
        errCode: 0,
        message: 'Sign out success!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async refreshToken(user: Users, res: Response) {
    try {
      const currentUser = await this.usersRepository.findOne({
        where: { id: user.id, rfToken: user.rfToken },
      });
      if (!currentUser) {
        throw new BadRequestException();
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

      user.rfToken = refreshToken.value;
      await this.usersRepository.save(user);
      return {
        errCode: 0,
        message: 'Refresh token success!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    try {
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
      const forgotTokenExists = await this.tokensRepository.findOne({
        where: {
          userId: currentUser.id,
          expiredIn: MoreThan(new Date()),
        },
      });
      if (forgotTokenExists) {
        return {
          errCode: 0,
          message: FORGOT_ROUTE.SUCCESS,
        };
      }

      const forgotToken = randomBytes(32).toString('hex');
      const forgotTokenHash = await this.hashService.hash(forgotToken);

      const newForgotToken = this.tokensRepository.create({
        userId: currentUser.id,
        token: forgotTokenHash,
        expiredIn: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      await this.tokensRepository.save(newForgotToken);
      this.nodemailerService.sendEmail({
        to: currentUser.email,
        subject: 'BanhTheCake - Forgot password',
        html: generateHtml({
          username: currentUser.username,
          linkToActive: `http://localhost:3000/api/users/forgot?token=${forgotToken}&id=${currentUser.id}`,
          label: 'forgot',
        }),
      });
      return {
        errCode: 0,
        message: FORGOT_ROUTE.SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const { token, password, userId } = data;
      const existToken = await this.tokensRepository.findOne({
        where: { userId, expiredIn: MoreThan(new Date()) },
      });
      if (!existToken) {
        throw new BadRequestException(RESET_PASSWORD_ROUTE.INVALID_TOKEN);
      }
      const isValid = await this.hashService.verify(token, existToken.token);
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
        this.tokensRepository.remove(existToken),
      ]);
      return {
        errCode: 0,
        message: RESET_PASSWORD_ROUTE.SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async changePassword(data: ChangePasswordDto, user: Users) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async changeInfo(data: InfoDto, user: Users) {
    try {
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
      return {
        errCode: 0,
        message: INFO_ROUTE.SUCCESS,
        data: updateUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async changeAvatar(file: Express.Multer.File, user: Users) {
    try {
      const currentUser = await this.usersRepository.findOne({
        where: { id: user.id },
      });
      if (!currentUser) {
        throw new BadRequestException(CHANGE_AVATAR_ROUTE.USER_NOT_FOUND);
      }
      const image = await this.imagesService.helpers.upload.single(
        file,
        currentUser,
      );
      currentUser.avatar = image.url;
      await this.usersRepository.save(currentUser);
      return {
        errCode: 0,
        message: CHANGE_AVATAR_ROUTE.SUCCESS,
        data: currentUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async follow(data: FollowDto, userId: string) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async getFollow(userId: string, query: FollowQueryDto) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
