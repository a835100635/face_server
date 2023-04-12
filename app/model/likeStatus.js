/**
 *
 * 点赞点踩
 * @param { Egg } app egg实例
 */
const Topic = require('./topic');
const { LIKE_ENTITY_TYPES, LIKE_STATUS } = require('../../constants/index');
const { TOPIC, COMMENT } = LIKE_ENTITY_TYPES;
const { LIKE, DISLIKE } = LIKE_STATUS;

module.exports = app => {
  const { STRING, INTEGER, ENUM, DataTypes } = app.Sequelize;
  const likeStatus = app.model.define('LikeStatus', {
    // 点赞id
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 点赞类型
    type: {
      type: ENUM(TOPIC, COMMENT),
      allowNull: false,
    },
    // 创建用户 openid
    userId: {
      type: STRING(64),
      allowNull: false,
    },
    // 点赞状态 LIKE点赞 DISLIKE点踩 互斥
    status: {
      type: ENUM(LIKE, DISLIKE, ''),
      allowNull: true,
    },
    // 题目id
    topicId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // 评论id
    commentId: {
      type: INTEGER,
      allowNull: true,
    },
    // 描述
    desc: STRING,
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: false,
  });
  likeStatus.options.modelDependencies = [ Topic ];
  // 关联关系
  likeStatus.associate = () => {
    app.model.Topic.hasMany(app.model.LikeStatus, {
      foreignKey: 'topicId',
      sourceKey: 'id' }
    );
    app.model.LikeStatus.belongsTo(app.model.Topic, { 
      foreignKey: 'topicId', 
      targetKey: 'id' 
    });
  };
  return likeStatus;
};
