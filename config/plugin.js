'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 引入egg-sequelize包
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  jwt: {
    // 是否开启
    enable: true,
    // 依赖的包
    package: 'egg-jwt',
  },
};
