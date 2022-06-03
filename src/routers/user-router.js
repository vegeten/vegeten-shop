import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuth, refresh_, customError } from '../middlewares';
import { userService } from '../services';
import { sendMail } from '../utils/send-mail';
import bcrypt from 'bcrypt';
import { User } from '../db';
import passport from 'passport';

const userRouter = Router();

//kakao
const passportConfig = require('../passport');
passportConfig();

userRouter.get('/kakao', passport.authenticate('kakao'));

userRouter.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  async (req, res) => {
    try {
      const { username, _json, id, provider } = req.user;
      const email = _json.kakao_account.email;
      const fullName = username;
      const password = String(id);

      const user = await userService.getUserByEmail(email);
      if (!user || user === undefined || user === null) {
        const userInfo = {
          email: email,
          password: String(password),
          fullName: fullName,
          provider: provider,
        };
        const newUser = await userService.addUser(userInfo);
      }

      // // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
      const userToken = await userService.getUserToken({ email, password });
      const { token, refreshToken } = userToken;
      const accessToken = token;
      // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)

      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 1209600000),
      });
      res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      });
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
);

//refresh
userRouter.get('/refresh', refresh_);

// 회원가입 (/api/users/register)
userRouter.post('/register/send-mail', async (req, res, next) => {
  try {
    const { email } = req.body;
    const savedEmail = await userService.getUserByEmail(email);
    if (!savedEmail || savedEmail === null || savedEmail === undefined) {
      const randomNumber = Math.floor(Math.random() * 10 ** 6)
        .toString()
        .padStart(6, '0');
      sendMail(email, `인증번호는 ${randomNumber} 입니다.`);
      res.status(200).json({
        status: 200,
        message: '이메일 인증번호가 이메일로 전송되었습니다.',
        data: randomNumber,
      });
      return;
    }
    throw new customError(409, '이미 가입된 이메일입니다.');
  } catch (error) {
    next(error);
  }
});

userRouter.post('/register', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    await userService.addUser(req.body);

    res.status(201).json({
      status: 201,
      message: '회원가입 성공',
    });
  } catch (error) {
    next(error);
  }
});

// 로그인 (/api/users/login)
userRouter.post('/login', async function (req, res, next) {
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

userRouter.post('/reset-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('해당 메일로 가입된 사용자가 없습니다.');
    }

    // 랜덤 패스워드 생성하기
    const randomPassword = Math.floor(Math.random() * 10 ** 8)
      .toString()
      .padStart(8, '0');

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    await userService.setUserPartially({ userId: user.shortId }, { password: hashedPassword });

    // 패스워드 발송하기
    sendMail(email, '[vegeten] 비밀번호가 변경되었습니다.', `변경된 비밀번호는 ${randomPassword} 입니다.`);
    res.status(200).json({ status: 200, message: '임시 비밀번호가 이메일로 전송되었습니다.' });
  } catch (error) {
    next(error);
  }
});

userRouter.post('/password', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const userId = req.currentUserId;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { currentPassword } = req.body;
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    // 비밀번호 일치 여부를 확인 후 프론트에게 보내줌
    await userService.matchPassword(userInfoRequired);
    res.status(200).json({
      status: 200,
      message: '비밀번호가 일치합니다.',
    });
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록 조회 (/api/users/list) ⇒ admin 한정
userRouter.get('/list', adminAuth, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '전체 유저 목록 조회 성공',
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// 유저 정보 조회 (/api/users/)
userRouter.get('/', loginRequired, async function (req, res, next) {
  const userId = req.currentUserId;
  try {
    // 특정 id에 맞는 사용자 정보를 얻음
    const user = await userService.getUser(userId);
    if (user === null || !user) {
      res.json({ message: '없는 유저입니다.' });
      return;
    }

    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '유저 정보 조회 성공',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// 유저 정보 수정 (/api/users/)
userRouter.patch('/', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const userId = req.currentUserId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { fullName, password, address, phoneNumber, role, currentPassword } = req.body;
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(role && { role }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(userInfoRequired, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json({
      status: 200,
      message: '유저 정보 수정 성공',
      data: updatedUserInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 유저 기본 주소 수정 (/api/users/address)
userRouter.patch('/address', loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    if (!userId) {
      throw new Error('유저 정보 만료');
    }

    const { address } = req.body;
    const userInfoRequired = { userId };

    const toUpdate = {
      ...(address && { address }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUserPartially(userInfoRequired, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(201).json({
      status: 201,
      message: '유저 주소 수정 성공',
      data: updatedUserInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 삭제 (탈퇴) (/api/users)
userRouter.delete('/', loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    // 특정 id에 맞는 사용자 정보를 삭제함
    await userService.deleteUser(userId);

    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '유저 정보 삭제 성공',
      data: {
        userId: userId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { userRouter };
