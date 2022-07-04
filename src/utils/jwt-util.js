import jwt from 'jsonwebtoken';
import { userService } from '../services';
const secret = process.env.JWT_SECRET_KEY;

const sign = (user) => {
  const payload = {
    userId: user.shortId,
    role: user.role,
  };

  return jwt.sign(payload, secret, {
    // secret으로 sign하여 발급하고 return
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '3s', // 유효기간
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
    expiresIn: '10s',
  });

  userService.setUserPartially(
    { userId },
    {
      refresh: refreshToken,
    }
  );

  return refreshToken;
};

const refreshVerify = async (token, userId) => {
  const isVaildate = verify(token);
  // 토큰이 만료되었을 때
  if (!isVaildate.ok && isVaildate.message === 'jwt expired') {
    const user = await userService.getUser(userId);
    const savedRefreshToken = user.refresh;
    console.log('saved: ', savedRefreshToken);

    // 저장된 토큰과 같으면 새로운 토큰 보냄
    if (savedRefreshToken === token) {
      const newRefreshToken = refresh(userId);
      console.log('새로운 refresh token 발급');
      return newRefreshToken;
    }
    // 저장된 토큰과 같지 않으면
    return false;
  }
  // 토큰이 유효할 때 기존 토큰 보냄

  return token;
};

export { sign, verify, refresh, refreshVerify, secret };
