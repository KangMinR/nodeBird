const passport = require('passport');
const { Strategy: KaKaoStrategy } = require('passport-kakao');
const User = require('../models/user');

module.exports = () => {
  passport.use(new KaKaoStrategy({ 
    clientID: process.env.KAKAO_ID, //여기에 .env에서 rest api키가 들어감
    callbackURL: '/auth/kakao/callback', //카카오로그인 RedirectURI 설정에 똑같이 써준다
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({
        where : { snsId: profile.id, provider: 'kakao' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._json?.kakao_account?.email, //여기 구조가 계속 바뀜. 만약 여기서 에러가 난다면 위에 console.log profile 한 곳에서 구조 확인후수정
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao', 
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};