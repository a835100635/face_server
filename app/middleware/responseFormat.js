/**
 * response 统一格式化
 */

module.exports = function ResponseFormatMiddleware() {
  return async (ctx, next) => {
    // next 上方是request
    await next();
    // next 下方是 response

    ctx.body = {
      code: 200,
      data: ctx.body,
      message: 'success',
    };
  };
};
