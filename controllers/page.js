exports.renderProfile = (req, res, next) => {
  //컨트롤러는 서비스를 호출한다
  res.render('profile', { title: '내 정보 - NodeBird' }); //render니까 파일이 있어야 한다. views/profile.html 생성
};
exports.renderJoin = (req, res, next) => {
  res.render('join', { title: '회원 가입 - NodeBird' }); //views/join.html 생성
};
exports.renderMain = (req, res, next) => { //views/main.html 생성
  res.render('main', {
    title: 'NodeBird',
    twits: [], //메인 화면에서 보여줄 트윗들을 미리 배열로 생성해 놓았다
  }); 
};

//res.locals한 데이터도 profile로 넘어가지만 두 번째 인수로 넘긴 객체도 프론트로 넘어간다. 즉, res.locals와 객체가 합쳐져서 프론트로 넘어간다
//구조는 이렇다. 라우터는 컨트롤러를 호출. 컨트롤러는 서비스를 호출. 라우터 -> 컨트롤러 -> 서비스
//컨트롤러는 요청과 응답을 알고있다. 서비스는 요청, 응답을 모른다. 