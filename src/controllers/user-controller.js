// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { customError, validateDataType } from '../middlewares';
import { userService } from '../services';
import { sendMail } from '../utils/send-mail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sign, verify, refresh, refreshVerify, secret } from '../utils/jwt-util';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // POST 회원가입(/api/users/register)
  async register(req, res, next) {
    try {
      validateDataType(req, res, next);
      await userService.register(req.body);
      res.status(201).json({
        status: 201,
        message: '회원가입 성공',
      });
    } catch (error) {
      next(error);
    }
  }
  // POST 이메일 인증(/register/send-mail)
  async authenticateEmail(req, res, next) {
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
  }

  // 로그인 (/api/users/login)
  async login(req, res, next) {
    try {
      validateDataType(req, res, next);
      const userToken = await userService.getUserToken(req.body);
      const { token, refreshToken, exp } = userToken;
      const accessToken = token;
      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 1209600000),
      });
      res.json({ message: 'login success', data: { accessToken, refreshToken, exp } });
    } catch (error) {
      next(error);
    }
  }

  // 비밀번호 초기화(api/users/reset-password)
  async resetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new Error('해당 메일로 가입된 사용자가 없습니다.');
      }

      // 랜덤 패스워드 생성하기
      const randomPassword = Math.random().toString(36).substring(2, 11) + '!';

      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      await userService.setUserPartially({ userId: user.shortId }, { password: hashedPassword });

      // 패스워드 발송하기
      sendMail(email, '[vegeten] 비밀번호가 변경되었습니다.', `변경된 비밀번호는 ${randomPassword} 입니다.`);
      res.status(200).json({ status: 200, message: '임시 비밀번호가 이메일로 전송되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  // 비밀번호 확인('api/users/reset-password')
  async checkPassword(req, res, next) {
    try {
      validateDataType(req, res, next);
      const userId = req.currentUserId;
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
  }

  // 전체 유저 목록 조회 (/api/users/list) ⇒ admin 한정
  async getUsers(req, res, next) {
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
  }

  // 유저 정보 조회 (/api/users/)
  async getUser(req, res, next) {
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
  }

  // 유저 정보 수정 (/api/users/)
  async updateUser(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
      }
      const userId = req.currentUserId;
      const { fullName, password, address, phoneNumber, role, currentPassword } = req.body;
      if (!currentPassword) {
        throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
      }
      const userInfoRequired = { userId, currentPassword };
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
  }

  // 유저 기본 주소 수정 (/api/users/address)
  async updateUserAddress(req, res, next) {
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
  }

  // DELETE 사용자 정보 삭제 (탈퇴) (/api/users)
  async deleteUser(req, res, next) {
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
  }
  async refreshUser(req, res, next) {
    try {
      // access token과 refresh token의 존재 유무를 체크
      if (req.headers['authorization'] && req.headers.cookie.split('=')[1]) {
        const token = req.headers['authorization']?.split(' ')[1];
        const refreshToken = req.headers.cookie.split('=')[1];
        const authResult = verify(token);
        const decoded = jwt.decode(token);
        const user = await userService.getUser(decoded.userId);

        if (decoded === null) {
          res.status(401).send({
            ok: false,
            reason: 'No authorized!',
          });
          return;
        }

        const refreshResult = await refreshVerify(refreshToken, decoded.userId);
        // access token 만료(or 유효하지 않음)
        if (authResult.ok === false && authResult.message === 'jwt expired') {
          // refresh token 유효하지 않음
          if (!refreshResult) {
            res.json({
              ok: false,
              access: false,
              refresh: false,
              message: '토큰이 유효하지 않습니다. ',
            });
          } else {
            // 2. refresh token이 만료되지 않았거나, 만료되었어도 유효한 경우
            const newAccessToken = sign(user);
            const { exp } = jwt.decode(newAccessToken);
            res.cookie('refreshToken', refreshResult, {
              expires: new Date(Date.now() + 1209600000),
              httpOnly: true,
            });
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
            console.log('새로운 access token 발급');
          }
        } else {
          // access token이 만료되지 않은 경우
          console.log('기존 access 토큰이 유효합니다.');
          res.json({
            ok: true,
            access: true,
            refresh: true,
            message: '기존 access 토큰이 유효합니다.',
          });
        }
      } else {
        // access token 또는 refresh token이 헤더에 없는 경우
        console.log('Access token and refresh token are need for refresh!');
        res.status(400).json({
          ok: false,
          message: 'Access token and refresh token are need for refresh!',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController(userService);

export { userController };
