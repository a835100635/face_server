/**
 * 评论相关
 */

const { Controller } = require('egg');
class CommentController extends Controller {
  /**
   * 新增评论
   */
  async add() {
    console.log('新增评论');
  }
}

module.exports = CommentController;
