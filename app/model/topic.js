/**
 * 题目实体
 * @param { Egg } app egg实例
 */
module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;
  const category = app.model.define('Topic', {
    // 题目id
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 分类
    categoryId: INTEGER,
    // 题目
    topic: STRING,
    // 等级 1、2、3、4、5
    level: {
      type: INTEGER,
      defaultValue: 1,
    },
    // 题目类型 1-选择、2-填空、3-判断，4-开放
    type: INTEGER,
    // 答案 填空 判断
    answer: STRING,
    // 选项 选择 "{A:'',B:'',c:''}"
    options: STRING,
    // 正确选项 A
    correct: STRING,
    // 是否上线 0-下线，1-上线
    online: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 审核 0-待审核，1-审核通过，2-审核不通过
    status: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 创建者
    createUser: INTEGER,
    // 点赞次数
    like: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 点踩次数
    dislike: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 描述
    desc: STRING,
    // 创建时间
    createdTime: {
      type: DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    // 更新时间
    updatedTime: {
      type: DATE,
      allowNull: false,
      defaultValue: NOW,
    },
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: false,

  });
  return category;
};
