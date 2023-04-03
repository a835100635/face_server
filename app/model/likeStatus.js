/**
 *
 * 点赞点踩
 * @param { Egg } app egg实例
 */

const { LIKE_ENTITY_TYPES } = require('../../constants/index');
const { TOPIC, COMMENT } = LIKE_ENTITY_TYPES;

module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize;
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
    // 创建用户
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    // 点赞状态 LIKE点赞 DISLIKE点踩 互斥
    status: STRING,
    // 题目id
    topicId: {
      type: INTEGER,
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
  return likeStatus;
};
