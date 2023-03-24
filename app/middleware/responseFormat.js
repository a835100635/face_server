/**
 * response 统一格式化
 */

module.exports = function ResponseFormatMiddleware() {
  return async (ctx, next) => {
    try {
      // next 上方是request
      await next();
      // next 下方是 response
      const { status, message } = ctx.response;
      const { data, message: bodyMessage, code } = ctx.body || {};
      const is = 'data' in ctx.body && 'message' in ctx.body;
      ctx.body = {
        code: status === 200 ? 200 : (code || status),
        data: data || (is ? data : ctx.body) || null,
        message: status === 200 ? 'success' : (bodyMessage || message || '服务器异常'),
      };
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
