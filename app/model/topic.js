/**
 * 题目实体
 * @param { Egg } app egg实例
 */
const category = require('./category');

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4, DataTypes } = app.Sequelize;
  const topic = app.model.define('Topic', {
    // 题目id
    id: {
      type: DataTypes.UUID,
      // autoIncrement: true,
      primaryKey: true,
      defaultValue: UUIDV4,
      notNull: true,
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
    createUser: STRING(64),
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
  // egg-sequelize 插件在loadDatabase的时候会执行associate()，建立模型之间的关系
  // 一个题目可以有多个点赞
  topic.options.modelDependencies = [ category ];
  topic.associate = () => {
    // 一个题目只能属于一个分类
    app.model.Category.hasMany(app.model.Topic,
      { foreignKey: 'categoryId', sourceKey: 'id' }
    );
    app.model.Topic.belongsTo(app.model.Category,
      { foreignKey: 'categoryId', targetKey: 'id' }
    );
  };
  return topic;
};


