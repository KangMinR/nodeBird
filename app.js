const express = require('express');
const cookieParser = require('cookie-parser'); //쿠키를 위한 cookie-parser
const morgan = require('morgan'); //요청과 응답에 대한 로깅을 위한 morgan
const path = require('path'); //노드 내장 모듈. 경로를 위한 path
const session = require('express-session'); //로그인에 session을 사용하기 위한 session 
const nunjucks = require('nunjucks'); //화면 그릴때 필요한 nunjucks
const dotenv = require('dotenv'); //설정 파일인 .env를 불러오는 모듈

dotenv.config(); //process.env안에 .env값들이 들어간다
const pageRouter = require('./routes/page'); //노드버드 서비스의 페이지들을 page라우터 안에 몰아 넣을 것이다

const app = express();
app.set('port', process.env.PORT || 8001); //포트 설정
app.set('view engine', 'html'); //페이지들 확장자는 html
nunjucks.configure('views', { //html은 nunjucks를 통해서
  express: app,
  watch: true,
});

app.use(morgan('dev')); //로깅인데 개발모드로 -> 엄청 자세하게 로깅을 해준다
app.use(express.static(path.join(__dirname, 'public'))); //public 폴더를 static으로 ->프론트에서 자유롭게 public폴더안에 리소스에 접근가능
app.use(express.json()); //json요청 받을 수 있게 했다
app.use(express.urlencoded({ extended: false})); //form요청 받을수 있게 했다
app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키 전송 처리
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET, //cookieParser의 process~와 동일하게 작성해라
  cookie: {
    httpOnly: true, //자바스크립트에서 접근 불가능
    secure: false, //https적용할 때 true로 바꿔준다.
  }
}));

app.use('/', pageRouter); 
app.use((req, res, next) => { //프론트에서 요청을 보냈는데 page라우터에 걸리지 않은 경우 404 NOT FOUND
  const error = new Error('${req.method} ${req.url} 라우터가 없습니다.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) =>{
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err: {}; //배포모드가 아닐때는 에러를 표시. 배포모드일때는 에러는 화면에 표시 안 함
  res. status(err.status || 500);
  res.render('error'); //error는 views/error.html파일이 화면에 전송이 될 것이다. 
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});