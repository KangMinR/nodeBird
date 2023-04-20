const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({ //테이블 설정
      email: {
        type: Sequelize.STRING(40),  
        allowNull: true, //카카오톡 로그인을 할때 없는 경우도 있으므로
        unique: true, //다만 이메일이 있을 경우 고유해야 한다
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: { //email로 가입했으면 provider가 local이 된다
        type: Sequelize.ENUM('local', 'kakao'), //Sequelize.STRING하면 아무 문자열이나 다 사용가능하지만 ENUM을 사용하면 그것을 제한하는 것이다. 즉, local 아니면 kakao만 사용가능
        allowNull: false,
        defaultValue: "local"
      },
      snsId: { //카카오 로그인 전용. email이 없으면 snsId라도 있어야 한다. 소셜 로그인을 하면 아이디를 하나 주는데 그것을 기록하는 부분
        type: Sequelize.STRING(30),
        allowNull: true,
      } 
    }, {
        sequelize,
        timestamps: true, //createdAt, updatedAt 유저정보 생성일, 마지막으로 수정된 시간을 자동으로 기록을 해준다
        underscored: false,
        modelName: 'User',
        tablesName: 'user',
        paranoid: true, //deletedAt 추가됨. 유저 삭제일
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, { //다대다 관계에서는 중간 테이블이 생성된다
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow' //중간 테이블은 follow
    })
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow'
    })
  }
}

module.exports = User;

//model의 기본 구조이다. 클래스 하나 만들어 extends하고 initiate가 모델 정보들 입력하는 부분, 테이블 관게를 입력하는 associate부분
//model쪽 콛를 수정한다고 db도 바꾼 그대로 수정되는 것이 아니다. db도 model 수정 한 것처럼 바꾸려면 직접 컬럼을 수정해야 한다. 아니면 migration을 통해서 코드로 수정해야 한다
//즉, model만 바꿔서는 테이블을 바꿀 수 없다는 점을 꼭 명심하자