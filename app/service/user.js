/**
 * 用户服务
 */
const { Service } = require('egg');
const BadRequestException = require('../exception/badRequest');

class UserService extends Service {
  /**
   * 获取用户信息
   * @param {*} openid
   * @return
   */
  async user(openid) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({
      where: {
        openid,
      },
    });
    return user;
  }

  /**
   * 更新用户信息
   * @param {*} openid
   * @param {*} data
   * @return
   * @memberof UserService
   * @description
   * 1. 如果用户不存在，创建用户
   * 2. 如果用户存在，更新用户信息
   * 3. 返回用户信息
   * @example
   */
  async update(openid, data) {
    const { ctx } = this;
    try {
      await ctx.model.User.update({
        ...data,
      }, {
        where: {
          openid,
        },
      });
    } catch (error) {
      throw new BadRequestException('更新用户信息失败');
    }
    return {
      ...data,
    };
  }

  /**
   * 添加用户
   * @param openid
   * @param data
   */
  async add(openid, data) {
    const { ctx } = this;
    try {
      await ctx.model.User.create({
        openid,
        ...data,
      });
    } catch (error) {
      throw new BadRequestException('添加用户信息失败');
    }
    return {
      ...data,
    };
  }

}

module.exports = UserService;
