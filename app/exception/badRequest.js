/**
 * 错误请求 参数错误、
 */
const HttpException = require('./base');
class BadRequestException extends HttpException {
  constructor(message = '参数错误', errCode = -1) {
    super(errCode, message, null, 200);
  }
}
module.exports = BadRequestException;
