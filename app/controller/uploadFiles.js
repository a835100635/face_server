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
      throw new BadRequestException('服务异常', error);
    }
  }

  async delete() {
    const { ctx } = this;
    const { path } = ctx.request.body;
    if (!path) {
      throw new BadRequestException('文件名不存在');
    }
    const result = await ctx.service.uploadFiles.deleteFile(path);
    if (result) {
      ctx.body = {};
    } else {
      throw new BadRequestException('删除失败');
    }

  }
}


module.exports = UploadFilesController;
