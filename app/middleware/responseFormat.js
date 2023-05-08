/**
 * response 统一格式化
 */

module.exports = function ResponseFormatMiddleware() {
  return async (ctx, next) => {
    try {
      // next 上方是request
      await next();
      // next 下方是 response

      if (ctx.body) {
        ctx.body = ctx.body;
        return;
      } else {
        ctx.body = {
          code: 200,
          message: 'success',
          data: null,
        };
      }

    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        message: '服务器异常',
        data: null,
      };
    }
  };
};
