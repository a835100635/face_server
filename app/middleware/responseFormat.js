/**
 * response 统一格式化
 */

module.exports = function ResponseFormatMiddleware() {
  return async (ctx, next) => {
    try {
      // next 上方是request
      await next();
      // next 下方是 response
      const { status } = ctx.response;
      if (status !== 200) {
        ctx.status = status;
        ctx.body = ctx.body;
        return;
      }
      const { isError } = ctx.body || {};

      // 如果有返回数据，将返回数据添加到data中
      if (isError) {
        delete ctx.body.isError;
        ctx.body = ctx.body;
        return;
      } else {
        ctx.body = {
          code: 200,
          message: 'success',
          data: ctx.body,
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
