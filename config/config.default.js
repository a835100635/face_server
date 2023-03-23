/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

const dotenv = require('dotenv');
const path = require('path');

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
  config.middleware = [ 'log', 'responseFormat', 'errorHandler' ];

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

  config.sequelize = {
    dialect: 'mysql', // 数据库类型
    database: DB_NAME, // 数据库名称
    host: DB_HOST, // 数据库ip地址
    port: +(DB_PORT || 3306), // 数据库端口
    username: DB_USER, // 数据库用户名
    password: DB_PASSWORD, // 数据库密码
    timezone: '+08:00', // 更改为北京时区
    define: {
      // 表名是否和model的js文件名一致
      freezeTableName: false,
      underscored: true,
    },
    // operatorsAliases: {
    //   // 模糊搜索别名
    //   $link: Op.like,
    //   // 大于
    //   $gt: Op.gt,
    //   // 大于等于
    //   $gte: Op.gte,
    // },
  };

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
    domainWhiteList: [ '*' ],
  };

  return {
    ...config,
    ...userConfig,
  };
};
