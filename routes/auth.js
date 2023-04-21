const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

//POST /auth/join
router.post('/join', isNotLoggedIn, join);
//POST /auth/login
router.post('/login', isNotLoggedIn, login);
//POST /auth/logout
router.get('/logout', isLoggedIn, logout); 

// /auth/kakao
router.get('/kakao', passport.authenticate('kakao')); //화면에서 카카오톡 버튼을 누르면 일루 요청이 온다. 카카오톡 로그인 화면으로 redirect. 
// /auth/kakao -> 카카오톡로그인화면 -> /auth/kakao/callback

// /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', { //그럼 카카오톡에서 일루 redirect를 다시 해준다
  failureRedirect: '/?loginError=카카오로그인 실패', //로그인 실패한 경우 다시 리다이렉트
}), (req, res) => {
  res.redirect('/'); //성공한 경우 /리다이렉트
});


module.exports = router;