const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page');

router.use((req, res, next) => { //res.locals -> 라우터들에서 공통적으로 쓸 수 있는 변수
  res.locals.user = null; //지금은 빈 데이터를 넣어두겠다
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
});

router.get('profile', renderProfile); //라우터의 마지막 미들웨어 renderProfile 은 따로 부르는 이름이 있다. 컨트롤러라 한다. 
router.get('/join', renderJoin); //라우터의 마지막 미들웨어 renderJoin 컨트롤러
router.get('/', renderMain); //라우터의 마지막 미들웨어 renderMain 컨트롤러
//컨트롤러들을 따로 분리를 할 것이기 때문에 ccontorllers라는 폴더를 생성

module.exports = router;