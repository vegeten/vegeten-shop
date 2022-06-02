import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';

import { User } from '../db';

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_REST_API_KEY, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: '/api/users/kakao/callback', // 카카오 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne();
          if (exUser || exUser !== undefined) {
            done(null, profile);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nickname: profile.displayName,
              snsId: profile.id,
              providerType: 'kakao',
            });
          }
        } catch (error) {
          done(null, false, error);
        }
      }
    )
  );
};
