import { User } from '@/decorators/CurrentUser.decorator';
import { ApiAuth } from '@/decorators/auth-swagger.decorator';
import { Users } from '@/entities/user.entity';
import { InternalServerError } from '@/errors/internal-server.error';
import { Serialize } from '@/interceptors/serialize.interceptor';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
  refs,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  ActiveResponseDto,
  ActiveResponseError_hasActive,
  ActiveResponseError_invalidToken,
  ActiveResponseError_wrongFormat,
} from './dto/active-response.dto';
import { ActiveDto } from './dto/active.dto';
import {
  ChangeAvatarError_UnsupportedMediaType,
  ChangeAvatarError_UserNotFound,
  ChangeAvatarResponse,
} from './dto/avatar-response.dto';
import { AvatarDto } from './dto/avatar.dto';
import {
  ChangePasswordError_PasswordIncorrect,
  ChangePasswordError_UserNotFound,
  ChangePasswordResponse,
} from './dto/change-password-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotResponse } from './dto/forgot-response.dto';
import { InfoError_UserNotFound, InfoResponse } from './dto/info-response.dto';
import { InfoDto } from './dto/info.dto';
import { RefreshNewTokenResponse } from './dto/refresh-new-token-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ResetPasswordError_InvalidToken,
  ResetPasswordError_UserNotFound,
  ResetPasswordResponse,
} from './dto/reset-response.dto';
import {
  SignInResponse,
  SignInResponseError_incorrect,
} from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutResponse } from './dto/sign-out-response';
import {
  SignUpResponse,
  SignupResponseError_EmailExist,
  SignupResponseError_UsernameExist,
  SignupResponseError_notActive,
} from './dto/sign-up-response.dto';
import { SignupDto } from './dto/sign-up.dto';
import { UserResponse } from './dto/user.response';
import { AuthWithAccessToken } from './guards/access-token.guard';
import { AuthWithRefreshToken } from './guards/refresh-token.guard';
import { UsersService } from './users.service';
import { imageOptions } from './validators/image.validator';
import { UploadFileRequired } from '@/decorators/image.decorator';
import { FollowDto, FollowQueryDto } from './dto/follow.dto';
import {
  FollowError_AlreadyFollow,
  FollowError_UserNotFound,
  FollowError_Yourself,
  FollowResponse,
  GetFollowResponse,
} from './dto/follow-response.dto';
import { RefreshTokenResponse } from './strategies/refresh-token.strategy';

@ApiTags('users')
@ApiInternalServerErrorResponse({ type: InternalServerError })
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Hello' })
  @ApiOkResponse()
  hello() {
    return 'Hello from users controller';
  }

  @Post('active')
  @ApiOperation({ summary: 'Active your account' })
  @ApiExtraModels(
    ActiveResponseError_hasActive,
    ActiveResponseError_wrongFormat,
    ActiveResponseError_invalidToken,
  )
  @ApiOkResponse({
    type: ActiveResponseDto,
  })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        ActiveResponseError_hasActive,
        ActiveResponseError_wrongFormat,
        ActiveResponseError_invalidToken,
      ),
    },
  })
  active(@Body() data: ActiveDto) {
    return this.usersService.active(data);
  }

  @Post('signup')
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Sign up your account' })
  @ApiExtraModels(
    SignupResponseError_notActive,
    SignupResponseError_EmailExist,
    SignupResponseError_UsernameExist,
  )
  @ApiCreatedResponse({
    type: SignUpResponse,
  })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        SignupResponseError_notActive,
        SignupResponseError_EmailExist,
        SignupResponseError_UsernameExist,
      ),
    },
  })
  signup(@Body() data: SignupDto) {
    return this.usersService.signup(data);
  }

  @Post('signin')
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Sign in your account' })
  @ApiOkResponse({ type: SignInResponse })
  @ApiBadRequestResponse({ type: SignInResponseError_incorrect })
  signIn(@Body() data: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.usersService.signIn(data, res);
  }

  @Post('signout')
  @AuthWithRefreshToken()
  @ApiOperation({ summary: 'Sign out your account' })
  @ApiAuth()
  @ApiOkResponse({ type: SignOutResponse })
  signOut(@Res({ passthrough: true }) res: Response, @User() user: Users) {
    return this.usersService.signOut(res, user);
  }

  // Test access token
  @Get('accessToken')
  @AuthWithAccessToken()
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Test access token work or not' })
  @ApiAuth()
  @ApiOkResponse({ type: UserResponse })
  accessToken(@User() user: Users) {
    return user;
  }

  // Test refresh token
  @Get('refreshToken')
  @AuthWithRefreshToken()
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Test refresh token work or not' })
  @ApiAuth()
  @ApiOkResponse({ type: UserResponse })
  refreshToken(@User() user: Users) {
    return user;
  }

  // Get Info current user
  @Get('me')
  @AuthWithRefreshToken()
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Get info current user' })
  @ApiAuth()
  @ApiOkResponse({ type: UserResponse })
  me(@User() user: Users) {
    return this.usersService.me(user.id);
  }

  @Get('refreshNewToken')
  @AuthWithRefreshToken()
  @ApiOperation({ summary: 'Refresh new access token' })
  @ApiAuth()
  @ApiOkResponse({ type: RefreshNewTokenResponse })
  refreshNewToken(
    @User() user: RefreshTokenResponse,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.refreshToken(user, res);
  }

  @Post('forgot')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ type: ForgotResponse })
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.usersService.forgotPassword(data);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset password when forgot' })
  @ApiExtraModels(
    ResetPasswordError_InvalidToken,
    ResetPasswordError_UserNotFound,
  )
  @ApiOkResponse({ type: ResetPasswordResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        ResetPasswordError_InvalidToken,
        ResetPasswordError_UserNotFound,
      ),
    },
  })
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.usersService.resetPassword(data);
  }

  @Patch('me/password')
  @AuthWithAccessToken()
  @ApiOperation({ summary: 'Change password' })
  @ApiExtraModels(
    ChangePasswordError_UserNotFound,
    ChangePasswordError_PasswordIncorrect,
  )
  @ApiAuth()
  @ApiOkResponse({ type: ChangePasswordResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        ChangePasswordError_UserNotFound,
        ChangePasswordError_PasswordIncorrect,
      ),
    },
  })
  changePassword(@Body() data: ChangePasswordDto, @User() user: Users) {
    return this.usersService.changePassword(data, user);
  }

  @Patch('me/info')
  @AuthWithAccessToken()
  @Serialize(UserResponse)
  @ApiOperation({
    summary: 'Change info current user',
    description:
      'Body must have at least one of these properties : username, address',
  })
  @ApiAuth()
  @ApiOkResponse({ type: InfoResponse })
  @ApiBadRequestResponse({ type: InfoError_UserNotFound })
  changeInfo(@Body() data: InfoDto, @User() user: Users) {
    return this.usersService.changeInfo(data, user);
  }

  @Patch('me/avatar')
  @AuthWithAccessToken()
  @UseInterceptors(FileInterceptor('file', imageOptions))
  @Serialize(UserResponse)
  @ApiOperation({ summary: 'Change avatar user' })
  @ApiAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ChangeAvatarResponse })
  @ApiBadRequestResponse({ type: ChangeAvatarError_UserNotFound })
  @ApiUnsupportedMediaTypeResponse({
    type: ChangeAvatarError_UnsupportedMediaType,
  })
  uploadAvatar(
    @UploadFileRequired()
    file: Express.Multer.File,
    @User() user: Users,
    @Body() _: AvatarDto, // AvatarDto to make swagger understand file
  ) {
    return this.usersService.changeAvatar(file, user);
  }

  @Post('follow')
  @AuthWithAccessToken()
  @ApiAuth()
  @ApiOperation({ summary: 'Follow or unfollow user' })
  @ApiExtraModels(
    FollowError_UserNotFound,
    FollowError_AlreadyFollow,
    FollowError_Yourself,
  )
  @ApiOkResponse({ type: FollowResponse })
  @ApiBadRequestResponse({
    schema: {
      oneOf: refs(
        FollowError_UserNotFound,
        FollowError_AlreadyFollow,
        FollowError_Yourself,
      ),
    },
  })
  follow(@Body() data: FollowDto, @User() user: Users) {
    return this.usersService.follow(data, user.id);
  }

  @Get('me/follow')
  @AuthWithAccessToken()
  @Serialize(UserResponse)
  @ApiAuth()
  @ApiOperation({ summary: 'Get follow user (follower of following)' })
  @ApiOkResponse({ type: GetFollowResponse })
  getFollow(@User() user: Users, @Query() query: FollowQueryDto) {
    return this.usersService.getFollow(user.id, query);
  }
}
