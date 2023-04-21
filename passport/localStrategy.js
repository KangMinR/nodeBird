const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

module.exports = () => { //이게 실행이 되면서 여기서 로그인 시켜도 되는지 아닌지를 판단해줌. 여기서 로그인이 시켜도 된다 라고 하면 auth.js로 돌아감.
  passport.use(new LocalStrategy({ //LocalStrategy를 미리 등록해놓는 부분
    usernameField: 'email', //req.body.email을 받아서 usernameField로 간주하겠다
    passwordField: 'password', //req.body.password를 받아서 passwordField로 간주하겠다
    passReqToCallback: false
  }, async (email, password, done) => { //여기가 로그인을 해야되는지 판단해 주는 부분. done(서버실패, 성공유저, 로직실패)
    try {
      const exUser = await User.findOne({ where: { email }}); //유저가 이메일이 있는지 우선 확인
      if (exUser) { //이메일이 있으면 비밀번호 비교
        const result = await bcrypt.compare(password, exUser.password); //exUser.password는 DB에 저장된 비밀번호 password는 사용자가 입력한 비번
        if(result) { //일치 한다면
          done(null, exUser); //서버실패가 아니고 성공유저는 exUser 즉, 사용자 정보를 넣어줬다. 로그인 성공한 경우
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다' }) //서버에 에러도 없는데 로그인은 시켜주면 안 되는 경우 3번째 자리에 이유를 적어준다
        }
      } else {
          done(null, false, { message: '가입되지 않은 회원입니다.' }) //done이 호출되는 순간 controllers/auth.js의 passport.autenticate('local,~)부분으로 간다
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};