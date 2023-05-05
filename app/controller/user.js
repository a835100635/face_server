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
    const info = await this.getInfoByCode(code);
    const { openid } = info;
    console.log('openid', openid);
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
        const { url } = await ctx.service.uploadFiles.moveFile(customAvatarUrl, targetFileName);
        // 更新用户信息
        ctx.request.body.customAvatarUrl = url || ctx.request.body.customAvatarUrl;
      }
      ctx.body = await ctx.service.user.update(openid, ctx.request.body);
    } else {
      ctx.body = await ctx.service.user.add(openid, ctx.request.body);
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
}


module.exports = UserController;
