const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user'); //User불러오기. 회원가입, 로그인을 해야 하니까

module.exports = () => { //passport설정을 여기서. 이 함수가 app.js의 passportConfig에서 불러와져서 passportConfig();로 실행이 되는것
  passport.serializeUser((user, done) => { //user === exUser
    done(null, user.id); //user에서 user의 아이디만 꺼내서 저장. 그 저장한 것이 app.js에서 app.use(session)즉, 세션으로 저장됨
  });
  // 세션은 이런 형태의 객체이다 { 12345235: 1} 즉, { 세션쿠키: 유저아이디 } -> 메모리에 저장됨. user가 너무 많으면 그 많은 user를 메모리에 다 저장하는건 별로 좋지 않아서
  // id만 따로 뽑아서 저장하는 것이다. 

  passport.deserializeUser((id, done) => { //로그인 후에 그다음부터 요청이 들어오면 라우터에 요청이 도달하기 전에 passport.session미들웨어가 이 메서드 호출
    User.findOne({ where: { id }})
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
};

//connect.sid 세션 쿠키를 읽고 세션 객체를 찾아서 req.session으로 만듦 -> req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
// -> 조회된 사용자 정보를 req.user에 저장 -> 라우터에서 req.user 객체 사용 가능
//req.session은 사용자 간에 공유되는 데이터이다. 사용자가 로그아웃하기 전까지는 여기에 데이터가 다 남아있게 된다 
//connect.sid 쿠키로 세션에서 찾을때 req.session이 생성된다