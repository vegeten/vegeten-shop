import { userModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verify, sign, refresh, refreshVerify } from '../utils';
import { customError } from '../middlewares/error/customError';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async register(userInfo) {
    const { email, fullName, password, phoneNumber, address } = userInfo;
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new customError(409, '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { fullName, email, password: hashedPassword, phoneNumber, address };
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  // 로그인
  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new customError(409, '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
    if (!isPasswordCorrect) {
      throw new customError(409, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }
    const token = sign(user);
    const refreshToken = await refresh(user.shortId);
    const exp = jwt.decode(token).exp;
    return { token, refreshToken, exp };
  }

  // admin 로그인
  async getAdminToken(loginInfo) {
    const { email, password } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new customError(409, '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
    if (!isPasswordCorrect) {
      throw new customError(403, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.');
    }
    if (user.role !== 'admin') {
      throw new customError(403, '관리자만 접근 가능합니다.');
    }
    const token = sign(user);
    const refreshToken = await refresh(user.shortId);
    const exp = jwt.decode(token).exp;

    return { token, refreshToken, exp };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }
  // 특정 사용자 정보를 받음
  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }
  // 특정 사용자 정보를 받음
  async getUserByEmail(Email) {
    const user = await this.userModel.findByEmail(Email);
    return user;
  }
  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new customError(404, '가입 내역이 없습니다. 다시 한 번 확인해주세요.');
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(currentPassword, correctPasswordHash);
    if (!isPasswordCorrect) {
      throw new customError(403, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.');
    }
    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });
    return user;
  }

  async setUserPartially(userInfoRequired, toUpdate) {
    const { userId } = userInfoRequired;
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new customError(404, '가입 내역이 없습니다. 다시 한 번 확인해주세요.');
    }

    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });
    return user;
  }

  // 특정 사용자 정보 삭제
  async deleteUser(userId) {
    return userModel.delete(userId);
  }

  // 사용자 비밀번호 일치 여부 확인
  async matchPassword(userInfoRequired) {
    const { userId, currentPassword } = userInfoRequired;

    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new customError(404, '가입 내역이 없습니다. 다시 한 번 확인해주세요.');
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(currentPassword, correctPasswordHash);
    if (!isPasswordCorrect) {
      throw new customError(403, '비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.');
    }
    return true;
  }
}
const userService = new UserService(userModel);
export { userService };
