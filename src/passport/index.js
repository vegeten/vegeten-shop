const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../db');

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_REST_API_KEY,
        callbackURL: process.env.REDIRECT_URI, // 카카오 로그인 Redirect URI 경로
      },
      // clientID에 카카오 앱 아이디 추가
      // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
      // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
      // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      function (accessToken, refreshToken, profile, done) {
        const result = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile,
        };
        console.log('KakaoStrategy', result);
        done.result = result;
        return done;
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
