/**
 * 上传文件
 */

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');

class UploadFilesController extends Controller {
  async upload() {
    const { ctx } = this;
    // 获取 Stream文件流
    try {
      const stream = await ctx.getFileStream(); // 文件不存在将响应400错误
      if (!stream) {
        throw new BadRequestException('文件不存在');
      }
      const result = await ctx.service.uploadFiles.upload(stream);
      if (result) {
        ctx.body = result;
      } else {
        throw new BadRequestException('上传失败');
      }
    } catch (error) {
      throw new BadRequestException('文件不存在');
    }
  }
}


module.exports = UploadFilesController;
