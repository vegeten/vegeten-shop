import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminAuth } from '../middlewares';
import { userService } from '../services';

const adminRouter = Router();

// 어드민 로그인 (/api/admin/login)
adminRouter.post('/login', async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken(req.body);
    const { token, refreshToken, exp } = userToken;
    const accessToken = token;
    // console.log(token, refreshToken, exp);
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 1209600000),
    });
    res.json({ message: 'login success', data: { accessToken, refreshToken, exp } });
  } catch (error) {
    next(error);
  }
});

export { adminRouter };
