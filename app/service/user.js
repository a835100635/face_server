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
        }
      });
      const userData = await ctx.model.User.findOne({
        where: {
          openid,
        },
        attributes: ['id', 'gender', 'avatarUrl', 'city', 'country', 'province', 'nickName', 'userName', 'customAvatarUrl', 'language', 'slogan', 'score']
      })
      return userData;
    } catch (error) {
      throw new BadRequestException('更新用户信息失败');
    }
  }

  /**
   * 添加用户
   * @param openid
   * @param data
   */
  async add(openid, data) {
    const { ctx } = this;
    try {
      const userData = await ctx.model.User.create({
        openid,
        ...data,
      }, {
        attributes: ['gender', 'avatarUrl', 'city', 'country', 'province', 'nickName', 'userName', 'customAvatarUrl', 'language',]
      });
      return userData;
    } catch (error) {
      throw new BadRequestException('添加用户信息失败');
    }
  }

  /**
   * 获取用户积分日志
   * @param {*} openid 
   * @param {*} pageNum 
   * @param {*} pageSize 
   * @returns 
   */
  scoreLogList(openid, pageNum, pageSize) {
    const { ctx } = this;
    try {
      const scoreLogList = ctx.model.ScoreLog.findAndCountAll({
        where: {
          userId: openid,
        },
        limit: +pageSize,
        offset: (+pageNum - 1) * +pageSize,
      });
      const { count = 0, rows = [] } = scoreLogList;
      return {
        total: count,
        data: rows,
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('获取用户积分日志失败');
    }
  }

  /**
   * 修改用户积分 新增 扣除
   * @param {*} data
   * @return
   */
  changeScore(data) {
    const { openid, score, type } = data
    const { ctx } = this;
    try {
      ctx.model.User.update({
        score: ctx.model.literal(`score ${type === 'add' ? '+' : '-'} ${score}`),
      }, {
        where: {
          openid,
        }
      });
      return true;
    } catch (error) {
      throw new BadRequestException('修改用户积分失败');
    }
  }

  /**
   * 记录用户积分
   */
  async addScoreLog(data) {
    const { ctx } = this;
    try {
      await ctx.model.ScoreLog.create({
        ...data,
      });
      return true;
    } catch (error) {
      throw new BadRequestException('记录用户积分失败');
    }
  }

}

module.exports = UserService;
