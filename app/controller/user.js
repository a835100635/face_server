/**
 * 用户操作
 */

const { Controller } = require('egg');
const axios = require('axios');
const BadRequestException = require('../exception/badRequest');

class UserController extends Controller {

  /**
   * 登录获取openid
   */
  async login() {
    const { ctx, app } = this;
    const { code } = ctx.request.body;
    // 获取 openid
    const info = await this.getInfoByCode(code);
    const { openid } = info;
    // 判断是否存在用户
    const user = await ctx.service.user.user(openid);
    // 不存在则创建用户
    if (!user) {
      await ctx.service.user.add(openid, {});
    }
    // 生成 token
    const jwtToken = ctx.app.jwt.sign(
      {
        token: openid,
      },
      app.config.jwt.secret,
      {
        // 时间根据自己定，具体可参考jsonwebtoken插件官方说明
        expiresIn: '7d',
      }
    );
    ctx.body = {
      token: jwtToken,
    };
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo() {
    const { ctx } = this;
    const { openid } = ctx.state.userInfo;
    // 判断是否存在用户
    const user = await ctx.service.user.user(openid);
    if (user) {
      // 自定义头像
      const { customAvatarUrl } = ctx.request.body;
      if (customAvatarUrl) {
        // 七牛云临时文件移动到正式文件夹
        const userDir = process.env.QINIU_USER_IMG;
        // 文件名
        const filename = customAvatarUrl.split('/')[customAvatarUrl.split('/').length - 1];
        // 目标文件名
        const targetFileName = `${userDir}${filename}`
        const newFilePath = await ctx.service.uploadFiles.moveFile(customAvatarUrl, targetFileName);
        if (!newFilePath) {
          throw new BadRequestException('头像处理失败');
        }
        // 更新用户信息
        ctx.request.body.customAvatarUrl = newFilePath;
      }
      // 自定义头像设置为空
      if ('customAvatarUrl' in ctx.request.body && ['', null, undefined].includes(customAvatarUrl) && user.customAvatarUrl) {
        await ctx.service.uploadFiles.deleteFile(user.customAvatarUrl);
      }
      const result = await ctx.service.user.update(openid, ctx.request.body);
      ctx.body = result;
    } else {
      throw new BadRequestException('用户不存在');
    }
  }

  /**
   * 请求小程序 获取openid
   * @param {*} code
   * @return
   */
  async getInfoByCode(code) {
    const appid = process.env.WEIXIN_APP_ID;
    const secret = process.env.WEIXIN_APP_SECRET;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    const res = await axios.get(url);
    if (res.data.errcode) {
      throw new BadRequestException('wxLogin ERROR');
    }
    // 解密 session_key，方便后续操作
    const sessionKey = res.data.session_key;
    const openid = res.data.openid;

    return { openid, sessionKey };
  }

  /**
   * 积分日志
   * @return
   */
  async scoreLogList() {
    const { ctx } = this;
    const { openid } = ctx.state.userInfo;
    const { pageNum = 1, pageSize = 20 } = ctx.query;
    const result = await ctx.service.user.scoreLogList(openid, pageNum, pageSize);
    ctx.body = result;
  }

  /**
   * 修改积分
   */
  async changeScore() {
    const { ctx } = this;
    const { openid } = ctx.state.userInfo;

    // 操作类型 根据操作类型定义积分加减
    const { operationType = 'SIGN_IN' } = ctx.request.body;
    // TODO: 暂时只有加分
    const type = 'add';
    // TODO: 暂时10分
    const score = 10;
    // TODO: 暂时1倍
    const rate = 1.5;
    // 修改积分
    await ctx.service.user.changeScore({ openid, score: score * rate, type });
    // 添加积分日志
    await ctx.service.user.addScoreLog({ userId: openid, change: score * rate, type, rate, source: operationType });
    ctx.body = '';
  }
}

module.exports = UserController;
