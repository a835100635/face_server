/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

const dotenv = require('dotenv');
const path = require('path');
// const { Op } = require('sequelize');

// 加载环境变量
const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../.env'), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
}).parsed;

if (!envConfig) {
  // 抛出错误 退出程序
  throw new Error("Can't load .env file");
}

const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, SERVER_PORT } = process.env;

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1679032735880_6613';

  // add your middleware config here
  config.middleware = ['log', 'responseFormat', 'errorHandler', 'authentication'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.logger = {
    level: 'DEBUG',
    outputJSON: true,
    encoding: 'utf-8',
    consoleLevel: 'DEBUG',
  };

  // 自定义 token 的加密条件字符串
  config.jwt = {
    secret: process.env.JWT_SECRET || 'face-egg',
    // 默认是关闭，如果开启，这会对所有请求进行自动校验；限定请求，请设置match做路径匹配
    // enable: true,
    match: /^\/api/, // 匹配的请求，会走jwt校验，否则忽略；例如登录接口需要被忽略；
    // jwt.sign(***,***,[options,***])方法中，options的默认设置可以在这里配置；
    sign: {
      // 多少s后过期。actionToken.js中,jwt.sing(plyload,secret,{expiresIn:number})会被合并，调用时设置优先级更高;
      expiresIn: process.env.JWT_EXPIRES || 60 * 60 * 24 * 7,
    },
  };

  config.sequelize = {
    dialect: 'mysql', // 数据库类型
    database: DB_NAME, // 数据库名称
    host: DB_HOST, // 数据库ip地址
    port: +(DB_PORT || 3306), // 数据库端口
    username: DB_USER, // 数据库用户名
    password: DB_PASSWORD, // 数据库密码
    timezone: '+08:00', // 更改为北京时区
    logging: false, // 是否打印日志
    define: {
      // 表名是否和model的js文件名一致
      freezeTableName: false,
      // 自动写入时间戳
      timestamps: true,
      // 所有驼峰命名格式化
      underscored: true,
      //字段生成软删除时间戳  deleted_at
      // paranoid: true,
      // deletedAt: 'deleted_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    // operatorsAliases: {
    // 模糊搜索别名
    // $link: Op.like,
    // 大于
    // $gt: Op.gt,
    // 大于等于
    // $gte: Op.gte,
    // },
  };

  // api 前缀
  config.apiPrefix = process.env.API_PREFIX || '';
  // token字段
  config.tokenField = process.env.TOKEN_PREFIX || 'X-Face-Token';

  config.cluster = {
    listen: {
      port: +(SERVER_PORT || 8621),
      // 0.0.0.0 表示监听所有网卡 部署后可以被外网访问
      hostname: '0.0.0.0',
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
    // 允许访问接口的白名单
    domainWhiteList: ['*'],
  };

  return {
    ...config,
    ...userConfig,
  };
};
