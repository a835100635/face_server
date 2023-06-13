/**
 * 资源管理
 * @param { Egg } app egg实例
 */

const category = require('./category');

module.exports = app => {
  const { STRING, INTEGER, NOW, DATE, DataTypes, TEXT } = app.Sequelize;
  const Resource = app.model.define('Resource', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 资源名称
    title: STRING,
    // 资源描述
    desc: TEXT('long'),
    // 资源地址
    resourceUrl: STRING,
    // 资源密码
    resourcePwd: STRING,
    // 资源分类
    categoryId: INTEGER,
    // 兑换类型 1 积分 2 金币
    saleType: INTEGER,
    // 兑换积分 0 代表免费
    score: DataTypes.FLOAT,
    // 兑换金币 0 代表免费 浮点类型
    price: DataTypes.FLOAT,
    // 资源标签 [a,b,c]
    tag: STRING,
    // 资源图片 [url,url,url]
    previewImage: STRING,
    // 资源作者
    userId: STRING(64),
    // 资源状态
    status: INTEGER,
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
    }
  }, {
    // freezeTableName默认值是 false 如果是false的话，会自动在表名后加s复数
    freezeTableName: true,
    // timestamps默认值是true，如实是true会自动添加上 create_time 和update_time两个字段
    timestamps: false,
  });

  Resource.options.modelDependencies = [ category ];
  Resource.associate = () => {
    // 一个文件只能属于一个分类
    app.model.Category.hasMany(app.model.Resource,
      { foreignKey: 'categoryId', sourceKey: 'id' }
    );
    app.model.Resource.belongsTo(app.model.Category,
      { foreignKey: 'categoryId', targetKey: 'id' }
    );
  };

  return Resource;
};
