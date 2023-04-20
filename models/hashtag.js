const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
  static initiate(sequelize) {
    Hashtag.init({
      title: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      paranoid: false,
      modelName: 'Hashtag',
      tableName: 'Hashtag',
      charset: 'uft8mb4',
      collate: 'utf8mb4_general_ci'
    })
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); 
  }
}

module.exports = Hashtag;

//model의 기본 구조이다. 클래스 하나 만들어 extends하고 initiate가 모델 정보들 입력하는 부분, 테이블 관게를 입력하는 associate부분