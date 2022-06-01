import { serializeUser, deserializeUser } from 'passport';
import local from './localStrategy'; // 로컬서버로 로그인할때
import kakao from './kakaoStrategy'; // 카카오서버로 로그인할때

import { findOne } from '../models/user';

export default () => {
  serializeUser((user, done) => {
    done(null, user.id);
  });

  deserializeUser((id, done) => {
    //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
    findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao(); // 구글 전략 등록
};
