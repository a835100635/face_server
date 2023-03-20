/**
 * 工具类函数
 */

module.exports = {
  /**
   * 解析url中的参数
   * @param {String} url request url
   * @return {Object} 请求参数
   */
  getRequestParams(url) {
    const theRequest = {};
    if (url.indexOf('?') !== -1) {
      const str = url.substr(url.indexOf('?') + 1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  },
};
