import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { redisClient } from './redis';
const secret = process.env.JWT_SECRET_KEY;

const sign = (user) => {
  // access token 발급
  const payload = {
    // access token에 들어갈 payload
    userId: user._id,
    role: user.role,
  };

  return jwt.sign(payload, secret, {
    // secret으로 sign하여 발급하고 return
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '1h', // 유효기간
  });
};

const verify = (userToken) => {
  // access token 검증
  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const userId = jwtDecoded.userId;

    // 라우터에서 req.currentUserId를 통해 유저의 id에 접근 가능하게 됨
    req.currentUserId = userId;

    next();
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });

    return;
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

export { sign, verify, refresh, refreshVerify };
