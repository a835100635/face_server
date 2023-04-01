/**
 * 鉴权
 */

module.exports = function AuthenticationMiddleware() {
  return async (ctx, next) => {
    // 从请求头中获取 token
    // const token = ctx.request.header.token;
    // if (!token) {
    //   ctx.status = 401;
    //   ctx.body = {
    //     code: 401,
    //     message: 'Missing authorization header'
    //   };
    //   return;
    // }
    // try {
    //   // 校验 token 是否有效
    //   const userInfo = await ctx.service.authService.verifyToken(token);
    //   ctx.state.user = userInfo;
    // } catch (error) {
    //   ctx.status = 401;
    //   ctx.body = {
    //     code: 401,
    //     message: error.message
    //   };
    //   return;
    // }

    ctx.state.user = {
      openid: '123123',
    };

    await next();
  };
};
