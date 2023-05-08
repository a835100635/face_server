/**
 * @fileOverview User Model
 * @module User
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;
  const user = app.model.define('User', {
    // 用户ID
    id: {
      type: STRING(6),
      defaultValue: '000000'
    },
    // 微信同步
    openid: {
      type: STRING(64),
      primaryKey: true,
    },
    // 用户名
    userName: {
      type: STRING(64),
      allowNull: true,
    },
    // 微信昵称
    nickName: {
      type: STRING(64),
      allowNull: true,
    },
    // 个性签名
    slogan: {
      type: STRING(30),
      allowNull: true,
    },
    // 积分
    score: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 头像
    avatarUrl: {
      type: STRING(255),
      allowNull: true,
    },
    // 自定义头像
    customAvatarUrl: {
      type: STRING(255),
      allowNull: true,
    },
    // 性别
    gender: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    // 国家
    country: {
      type: STRING(64),
      allowNull: true,
    },
    // 省份
    province: {
      type: STRING(64),
      allowNull: true,
    },
    // 城市
    city: {
      type: STRING(64),
      allowNull: true,
    },
    // 语言
    language: {
      type: STRING(64),
      allowNull: true,
    },
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

  // 实现 新增用户时id自增长，且6位数，以 000001、000002这种格式存在
  user.beforeCreate((user, options) => {
    return app.model.User.max('id').then(maxId => {
      let newId = parseInt(maxId, 10) + 1;
      if (isNaN(newId)) {
        newId = 1;
      }
      // 格式化 id
      user.id = String(newId).padStart(6, '0');
      return user;
    });
  });

  return user;
};
