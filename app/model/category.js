/**
 *
 * 分类
 * @param { Egg } app egg实例
 */
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const category = app.model.define('Category', {
    // 分类id html css。。。。
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 大类型 前端 后端。。。
    typeId: INTEGER,
    // 分类名称
    categoryName: STRING,
    // 描述
    desc: STRING,
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: false,
  });
  return category;
};
