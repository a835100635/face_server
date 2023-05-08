/**
 * 错误请求 参数错误、
 */
const HttpException = require('./base');
class ServiceErrorException extends HttpException {
  constructor(message = '服务错误', errCode = -1) {
    super(errCode, message, null, 500);
  }
}
module.exports = ServiceErrorException;
