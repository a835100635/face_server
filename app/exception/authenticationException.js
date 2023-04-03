/**
 * 鉴权失败异常
 */
const HttpException = require('./base');
class AuthenticationException extends HttpException {
  constructor(message = '鉴权失败', errCode = 401) {
    super(errCode, message, null, 401);
  }
}
module.exports = AuthenticationException;
