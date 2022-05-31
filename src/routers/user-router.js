import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuth } from '../middlewares';
import { userService } from '../services';
const userRouter = Router();

// 회원가입 (/api/users/register)
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
    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
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
    console.log(userId);

    const toUpdate = {
      ...(address && { address }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUserAddress(userInfoRequired, toUpdate);

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

// 유저 비밀번호 일치 여부 확인 (/api/users/password)
userRouter.post('/password', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
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

export { userRouter };
