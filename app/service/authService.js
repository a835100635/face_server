/**
 * @description: 用户登录
 */
const { Service } = require('egg');
const AuthenticationException = require('../exception/authenticationException');

class AuthService extends Service {
  verifyToken(token) {
    const { ctx, app } = this;
    const { jwt, config } = app;
    if (!token) {
      throw new AuthenticationException();
    }
    try {
      const jwtInfo = jwt.verify(token, config.jwt.secret);
      const { token: openid } = jwtInfo;
      // 从数据库中获取用户信息
      const userInfo = ctx.service.user.user(openid);
      return {
        openid,
        ...userInfo,
      };
    } catch (error) {
      throw new AuthenticationException();
    }
  }
}

module.exports = AuthService;
