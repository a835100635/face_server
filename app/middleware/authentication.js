/**
 * 鉴权
 */
const AuthenticationException = require('../exception/authenticationException');

module.exports = function AuthenticationMiddleware() {
  return async (ctx, next) => {
    const { app: { config: { apiPrefix, tokenField } }, request } = ctx;
    // 从请求头中获取 token
    const token = ctx.request.header[tokenField.toLowerCase()];
    // 产品名称
    const productName = ctx.request.header['x-ProductName'.toLowerCase()];

    // 白名单
    const whiteList = [
      // 登陆
      `${apiPrefix}/api/login`,
      // 分类
      `${apiPrefix}/api/category`,
    ];
    // 白名单跳过
    if (whiteList.some(item => item === request.url)) {
      await next();
    } else {
      if (!token || !productName || productName !== 'Face') {
        ctx.status = 401;
        throw new AuthenticationException();
      }
      try {
        // 校验 token 是否有效
        const userInfo = await ctx.service.authService.verifyToken(token);
        ctx.state.userInfo = userInfo;
      } catch (error) {
        ctx.status = 401;
        throw new AuthenticationException();
      }
      await next();
    }

  };
};
