import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { userService } from '../services';
const secret = process.env.JWT_SECRET_KEY;
// import { redisClient } from './redis';

const sign = (user) => {
  // access token 발급
  const payload = {
    // access token에 들어갈 payload
    userId: user.shortId,
    role: user.role,
  };

  return jwt.sign(payload, secret, {
    // secret으로 sign하여 발급하고 return
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '1h', // 유효기간
  });
};

const verify = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, secret);
    return {
      ok: true,
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

const refresh = async (userId) => {
  const refreshToken = jwt.sign({}, secret, {
    algorithm: 'HS256',
    expiresIn: '14d',
  });

  await userService.setUserPartially(
    { userId },
    {
      refresh: refreshToken,
    }
  );
  return refreshToken;
};

const refreshVerify = async (token, userId) => {
  try {
    const user = await userService.getUser(userId);
    const savedRefreshToken = user.refresh;
    if (token === savedRefreshToken) {
      try {
        const decoded = jwt.verify(token, secret);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export { sign, verify, refresh, refreshVerify, secret };
