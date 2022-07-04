import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { userService } from '../services';

const adminRouter = Router();

// 어드민 로그인 (/api/admin/login)
adminRouter.post('/login', async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    const userToken = await userService.getAdminToken(req.body);
    const { token, refreshToken, exp } = userToken;
    const accessToken = token;

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 1209600000),
      httpOnly: true,
    });

    res.json({ message: 'login success', data: { accessToken, refreshToken, exp } });
  } catch (error) {
    next(error);
  }
});

export { adminRouter };
