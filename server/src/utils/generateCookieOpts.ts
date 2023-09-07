import { CookieOptions } from 'express';

export const generateCookieOpts = (ms: number): CookieOptions => ({
  httpOnly: true,
  maxAge: ms, // 30d
  sameSite: 'lax',
  secure: false,
});
