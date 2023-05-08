/**
 * 积分操作类型
 * @param { Egg } app egg实例
 */

module.exports = app => {
  const { STRING, INTEGER, DataTypes } = app.Sequelize;
  const scoreType = app.model.define('ScoreType', {
    // 积分日志id
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      notNull: true
    },
    // 积分类型
    type: STRING(),
    // 积分
    score: DataTypes.INTEGER,
    // 奖励倍率
    rate: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    }
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: false,
  });

  return scoreType;
};