// refresh.js
import { verify, refreshVerify, sign, refresh, secret } from '../utils';
import jwt from 'jsonwebtoken';

async function refresh_ (req, res, next) {
  // access token과 refresh token의 존재 유무를 체크합니다.
  if (req.headers['authorization'] && req.headers['refresh']) {
    const token = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['refresh']?.split(' ')[1];

    const authResult = verify(token);
    const decoded = jwt.decode(token);
    console.log(authResult);
    console.log(decoded);

    if (decoded === null) {
      res.status(401).send({
        ok: false,
        message: 'No authorized!',
      });
    }

    const refreshResult = refreshVerify(refreshToken, decoded.userId);

    if (authResult.ok === false && authResult.message === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult.ok === false) {
        console.log('both expired')

      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(user);
        console.log(newAccessToken);
      }
    } else {
      console.log('access token is not expired');
    }
    next();
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).json({
      ok: false,
      message: 'Access token and refresh token are need for refresh!',
    });
  }
};

export { refresh_ };
