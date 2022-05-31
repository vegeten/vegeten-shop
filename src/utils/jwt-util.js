import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { redisClient } from './redis';
const secret = process.env.JWT_SECRET_KEY;

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
      message: err.message
    }

  }
};

const refresh = () => {
  // refresh token 발급
  return jwt.sign({}, secret, {
    // refresh token은 payload 없이 발급
    algorithm: 'HS256',
    expiresIn: '14d',
  });
};

const refreshVerify = async (token, userId) => {
  // refresh token 검증
  /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
  // const getAsync = promisify(redisClient.get).bind(redisClient);
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

export { sign, verify, refresh, refreshVerify, secret };
