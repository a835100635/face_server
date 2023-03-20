/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1679032735880_6613';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'log', 'responseFormat' ];

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
    database: 'hope_face', // 数据库名称
    host: '124.222.188.206', // 数据库ip地址
    port: '3306', // 数据库端口
    username: 'hope_face', // 数据库用户名
    password: 'asdhope!', // 数据库密码
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
      port: 8621,
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
