import { serializeUser, deserializeUser } from 'passport';
import kakao from './kakao-strategy'; // 카카오서버로 로그인할때
import passport from 'passport';

import { User } from '../db';

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  kakao();
};
