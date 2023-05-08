/**
 * 异常捕获
 */
const HttpException = require('../exception/base');

module.exports = function ErrorHandler() {
  return async (ctx, next) => {
    const method = ctx.request.method;
    // 当请求方法为OPTIONS，通常为axios做验证请求，直接响应httpStatus204 no content即可
    if (method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    try {
      await next();
    } catch (error) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', error, ctx);

      // 判断异常是不是自定义异常
      if (error instanceof HttpException) {
        const { code, message, data, isError } = error;
        ctx.status = code === -1 ? 200 : code;
        ctx.body = { code, message, data, isError };
        return;
      }

      // 最后其他异常统一处理
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器异常',
        data: null,
      };
    }
  };
};
