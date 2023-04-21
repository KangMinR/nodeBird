const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body; //프론트에서 요청한 대로 body에 3가지 생성된 것을 꺼내쓴다
  try {
    const exUser = await User.findOne({ where: { email } }); //유저가 있나 먼저 찾는다
    if (exUser) {
      return res.redirect('/join?error=exist'); //join.html에 alert가 팝업
    }
    const hash = await bcrypt.hash(password, 12);//bcrypt 암호화
    await User.create({
      email,
      nick,
      password: hash, 
    });
    return res.redirect('/'); //회원가입이 다 됐으면 메인화면으로 보내기 302 status
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
//Post /auth/login 여기로 form요청
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { //localStrategy 호출. 여기가 done이다. localStrategy에서 done이 호출되면 이리로 온다
    if (authError) {//서버에서 문제가 생겼을때. 서버실패
      console.error(authError);
      return next(authError); //에러처리 미들웨어에서 서버에러를 핸들링 하도록 넘긴다
    }
    if (!user ) {//유저가 없는경우-> 로직실패 했을때
      return res.redirect('/?loginError=${info.message}'); //localStrategy에서 로직실패 했을때의 메시지가 여기로 온다
    }
    return req.login(user, (loginError) => { //로그인 성공. passport/index의 passport.serializeUser가 실행됨. 이 부분이에 user가 localStrategy.js의 exUser다 
      if (loginError) { //여기서 최종으로 다시 검사.
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/'); //그래도 오류가 없으면 로그인 후 /로 리다이렉트.
    })
  })(req, res, next); 
};
//흐름. 로그인을 하면 passport.authenticate('local', ~) 이 실행 -> localStrategy.js의 미리 설정해둔 passport.use(new LocalStrategy~ 부분이 실행 ->
//거기서 usernameField, passwordField 등등을 받는다. ->try 부분에서 판단을 한다. 판단결과 done(서버실패, 성공유저, 로직실패) 이 중에 하나가 걸릴것이고 해당하는 부분 가지고 ->
//다시 controllers/auth.js로 돌아와서 (authError, user, info) => ~ 함수에 맞는 부분이 실행된다.
//-> 로그인이 성공하면 

exports.logout = (req, res, next) => { //세션 쿠키를 없애버린다. 따라서 브라우저 connect.sid가 남아있어도 {} 지워졌기 때문에 로그인이 되지 않는다. 
  req.logout (() => {
    res.redirect('/');
  })
};