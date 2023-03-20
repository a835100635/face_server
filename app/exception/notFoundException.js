/**
 * 资源不存在 异常
 */
const HttpException = require('./base');
class NotFoundException extends HttpException {
  constructor(message = '资源不存在', errCode = 404) {
    super(errCode, message, null, 404);
  }
}
module.exports = NotFoundException;
