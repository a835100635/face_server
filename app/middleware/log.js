

const { getRequestParams } = require('../utils/index');
/**
 * 记录请求日志
 * @return {(ctx: "egg".Context, next: any) => Promise<void>}
 * @class
 */
module.exports = function LogMiddleware() {
  return async (ctx, next) => {
    const startTime = Date.now();
    const { method, url } = ctx.request;
    const body = JSON.stringify(ctx.request.body);
    const params = JSON.stringify(getRequestParams(url));
    // 参数设置在request中
    ctx.request.params = params;
    // 请求日志
    ctx.logger.info(`[request][${method}][${url}] body: ${body}, params: ${params}`);
    await next();
    // 请求结束日志
    ctx.logger.info(
      '[response] end, status: %s, cost: %s, res: %s',
      ctx.response.status, `${Date.now() - startTime}s`,
      ctx.response.body ? `${JSON.stringify(ctx.response.body).substring(0, 50)}...` : ctx.response.body // 截取1000个字符
    );
  };
};
