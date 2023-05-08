/**
 * 积分日志表
 * @param { Egg } app egg实例
 */

const User = require('./user');

module.exports = app => {
  const { STRING, INTEGER, DataTypes } = app.Sequelize;
  const scoreLog = app.model.define('ScoreLog', {
    // 积分日志id
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      notNull: true
    },
    userId: {
      type: STRING(64),
      notNull: true
    },
    // 积分来源
    source: DataTypes.STRING,
    // 积分变化
    change: DataTypes.INTEGER,
    // 奖励倍率
    rate: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    }
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: true,
  });
  scoreLog.options.modelDependencies = [User];

  scoreLog.associate = () => {
    app.model.User.hasMany(app.model.ScoreLog, { foreignKey: 'userId', sourceKey: 'openid' });
    app.model.ScoreLog.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'openid' });
  }

  return scoreLog;
};