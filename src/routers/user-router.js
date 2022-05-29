import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuth } from '../middlewares';
import { userService } from '../services';
const userRouter = Router();
// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post('/register', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    // req (request)의 body 에서 데이터 가져오기
    const { fullName, email, password } = req.body;
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
    });

    res.status(201).json({
      status: 201,
      message: '회원가입 성공',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.post('/login', async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    // req (request) 에서 데이터 가져오기
    const { email, password } = req.body;
    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});
// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get('/userlist', adminAuth, async function (req, res, next) {
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

userRouter.get('/', loginRequired, async function (req, res, next) {
  const userId = req.currentUserId;
  console.log(userId);
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

// 특정 사용자 정보 조회
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.get('/:userId', loginRequired, async function (req, res, next) {
  try {
    // 특정 id에 맞는 사용자 정보를 얻음
    const user = await userService.getUser(req.params.userId);
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
// 사용자 정보 수정: 유저만 접근 가능
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

// 사용자 정보 삭제 (탈퇴)
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
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
