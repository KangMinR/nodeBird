const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: { //이미지를 넣었을 경우. 이미지도 테이블로 분리를 해서 별도의 관계를 지정하는 것이 좋다. 게시글이 1 이미지가 N 즉 1:N 관계가 되겠다. 근데 지금 프로젝트에서는 1개씩만 올리게끔 해놓았다.
        type: Sequelize.STRING(200),
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      paranoid: false,
      modelName: 'Post',
      tableName: 'posts',
      charset: 'uft8mb4',
      collate: 'utf8mb4_general_ci'
    })
  }

  static associate(db) {
    db.Post.belongsTo(db.User); //게시글은 User에게 속해 있다
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //Hashtag도 다대다 관계. as와 foreignKey를 적지 않는 이유는 테이블이 서로 이름이 달라서 틀릴 염려가 거의 없어서 그렇다
  }
}

module.exports = Post;

//model의 기본 구조이다. 클래스 하나 만들어 extends하고 initiate가 모델 정보들 입력하는 부분, 테이블 관게를 입력하는 associate부분