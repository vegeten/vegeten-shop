// refresh.js
import { verify, refreshVerify, sign, refresh, secret } from '../utils';
import jwt from 'jsonwebtoken';
import { userModel } from '../db';

async function refresh_(req, res, next) {
  try {
    // access token과 refresh token의 존재 유무를 체크합니다.
    if (req.headers['authorization'] && req.headers['refresh']) {
      const token = req.headers['authorization']?.split(' ')[1];
      const refreshToken = req.headers['refresh']?.split(' ')[1];

      const authResult = verify(token);
      const decoded = jwt.decode(token);
      const user = await userModel.findById(decoded.userId);

      if (decoded === null) {
        res.status(401).send({
          ok: false,
          reason: 'No authorized!',
        });
        return;
      }

      const refreshResult = await refreshVerify(refreshToken, decoded.userId);
      if (authResult.ok === false && authResult.message === 'jwt expired') {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
        if (refreshResult === false) {
          res.json({
            ok: false,
            access: false,
            refresh: false,
            message: '토큰이 만료되었습니다. 다시 로그인합니다.',
          });
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          const newAccessToken = sign(user);
          const { exp } = jwt.decode(newAccessToken);
          res.json({
            ok: false,
            access: false,
            refresh: true,
            message: '새로운 access token 발급',
            data: {
              newAccessToken,
              exp,
            },
          });
        }
      } else {
        res.json({
          ok: true,
          access: true,
          refresh: true,
          message: '기존 access 토큰이 유효합니다.',
        });
      }
    } else {
      // access token 또는 refresh token이 헤더에 없는 경우
      res.status(400).json({
        ok: false,
        message: 'Access token and refresh token are need for refresh!',
      });
    }
  } catch (error) {
    next(error);
  }
}

export { refresh_ };
