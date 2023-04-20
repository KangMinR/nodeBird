const Sequelize = require('sequelize');
const fs = require('fs'); //파일 읽기
const path = require('path'); //읽을 파일 경로 가져오기
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {}; //이 객체를 한번 import하면 그 안에 연결도 할 수 있고 모델들도 사용할 수 있다. 따라서 객체로 묶어서 exports하기 위해 썼다
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize; //시퀄라이즈 연결

const basename = path.basename(__filename); //index.js가 된다
fs.readdirSync(__dirname) //현재 폴더의 모든 파일을 조회
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'); //리눅스에서는 앞에 .을 붙이면 숨김 파일이다. 숨김파일 걸렀다. index.js는 모델이 아니므로 제외했다. //파일의 확장자는 .js이어야 한다
  })
  .forEach(file => {//현재 hashtag.js, post.js, user.js파일이 선택된 상태
    const model = require(path.join(__dirname, file)) //다이나믹 임포트를 통해 3파일을 받아왔다
    console.log(file, model.name); //model.name은 클래스 이름이 된다. ex)User
    db[model.name] = model; //db객체에 모델들을 하나씩 넣어줬다
    model.initiate(sequelize); //모델 initiate가 모델 파일이 몇개가 있던 자동으로 호출된다
  });
  Object.keys(db).forEach(modelName => { //모델 3개 다시 불러와서 
    console.log(db, modelName);
    if(db[modelName].associate) {
      db[modelName].associate(db); //initiate한 3개의 모델을 associate 호출. 이렇게 한번에 안하고 나눠서 하는 이유는 순서가 있기 때문이다. initiate를 하고 associate가 되어야 한다
    }
  })

module.exports = db;