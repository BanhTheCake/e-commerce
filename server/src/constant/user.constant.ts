// Route active account

export const ACTIVE_ROUTE = {
  SUCCESS: 'Active success! Please login again!',
  TOKEN_WRONG: 'token is not valid',
  ACCOUNT_HAS_ALREADY_ACTIVATED: 'This account has already activated!',
  TOKEN_INVALID: 'Invalid token',
};

// Route sign up

export const SIGN_UP_ROUTE = {
  ACTIVE_ACCOUNT: 'Please activate your account!',
  EMAIL_EXIST: 'Email has already exist!',
  USERNAME_EXIST: 'Username has already exist!',
  SUCCESS: 'Sign up success. Check your email to activate your account!',
};

// Route sign in

export const SIGN_IN_ROUTE = {
  INCORRECT: 'username/email or password is incorrect!',
  SUCCESS: 'Sign in success!',
};

// Route sign out

export const SIGN_OUT_ROUTE = {
  SUCCESS: 'Sign out success!',
};

// Refresh new token route

export const REFRESH_NEW_TOKEN_ROUTE = {
  SUCCESS: 'Refresh token success!',
};

// Forgot password route

export const FORGOT_ROUTE = {
  SUCCESS: 'Please check your email!',
};

// Reset password route

export const RESET_PASSWORD_ROUTE = {
  INVALID_TOKEN: 'Invalid token!',
  SUCCESS: 'Reset password success!',
  USER_NOT_FOUND: 'User not found!',
};

// Change password route

export const CHANGE_PASSWORD_ROUTE = {
  USER_NOT_FOUND: 'User not found!',
  PASSWORD_INCORRECT: 'Password is incorrect!',
  SUCCESS: 'Change password success!',
};

// Change Info route

export const INFO_ROUTE = {
  USER_NOT_FOUND: 'User not found!',
  SUCCESS: 'Change info success!',
};

// Change avatar route

export const CHANGE_AVATAR_ROUTE = {
  SUCCESS: 'Change avatar success!',
  USER_NOT_FOUND: 'User not found!',
  WRONG_IMAGE_TYPE: 'image only allowed type jpeg, jpg, png',
};

// Follow route

export const FOLLOW_ROUTE = {
  SUCCESS: (type: string) => `${type} success!`,
  USER_NOT_FOUND: 'User not found!',
  YOURSELF: 'You cannot follow yourself!',
  ALREADY_FOLLOW: 'You are already following this user!',
};
