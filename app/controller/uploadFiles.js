/**
 * 上传文件
 */

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');

class UploadFilesController extends Controller {
  async upload() {
    const { ctx } = this;
    const result = await ctx.service.uploadFiles.upload(ctx);
    if (result) {
      ctx.body = result;
    } else {
      throw new BadRequestException('上传失败');
    }
  }
}


module.exports = UploadFilesController;
