export interface IJwtKeyValue {
  access_token: string;
  access_token_expires_in: string;
  refresh_token: string;
  refresh_token_expires_in: string;
  active_token: string;
  active_token_expires_in: string;
  forgot_password_token: string;
  forgot_password_token_expires_in: string;
}

export type JwtType =
  | 'access_token'
  | 'refresh_token'
  | 'active_token'
  | 'forgot_password_token';
