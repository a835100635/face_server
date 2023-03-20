/**
 * 错误请求 参数错误、
 */
const HttpException = require('./base');
class BadRequestException extends HttpException {
  constructor(message = '参数错误', errCode = 400) {
    super(errCode, message, null, 400);
  }
}
module.exports = BadRequestException;
