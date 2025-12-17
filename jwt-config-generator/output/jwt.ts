import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const config = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  accessExpiresIn: '15m',
  refreshExpiresIn: '7d',
};

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.accessExpiresIn,
    algorithm: 'HS256',
  };
  return jwt.sign(payload, config.accessSecret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.refreshExpiresIn,
    algorithm: 'HS256',
  };
  return jwt.sign(payload, config.refreshSecret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.accessSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.refreshSecret) as TokenPayload;
};

export const generateTokenPair = (payload: TokenPayload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});
