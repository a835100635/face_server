/**
 * 点赞相关
 */

const { Controller } = require('egg');
const { LIKE_ENTITY_TYPES } = require('../../constants/index');
const BadRequestException = require('../exception/badRequest');

const { TOPIC, COMMENT } = LIKE_ENTITY_TYPES;
class LikeStatusController extends Controller {
  /**
   * 点赞
   * 点赞类型：题目、评论
   * 点赞状态：点赞、点踩
   * 题目点赞点踩互斥
   */
  async like() {
    const { ctx } = this;
    const { openid } = ctx.state.userInfo;
    const { type, topicId, commentId, status } = ctx.request.body;
    // 判断点赞类型
    if (type === TOPIC && topicId) {
      // 题目
      // 判断题目是否存在
      const topic = await ctx.service.topic.checkTopic({ value: topicId });
      if (!topic) {
        throw new BadRequestException('题目不存在');
      }

      // 判断是否已经点赞或者点踩
      const exist = await ctx.service.likeStatus.checkLikeStatus({ userId: openid, topicId, type: TOPIC });

      if (exist) {
        // 已经点赞或者点踩 执行更新
        await ctx.service.likeStatus.updateLikeStatus({ userId: openid, topicId, type: TOPIC, status });
      } else {
        await ctx.service.likeStatus.addLikeStatus({ userId: openid, topicId, type: TOPIC, status });
      }

    }

    // TODO: 滞后开发
    if (type === COMMENT && commentId) {
      // 评论
      // 判断评论是否存在
    }

    ctx.body = '';
  }

  /**
   * 取消点赞
   */
  async unlike() {
    const { ctx } = this;
    const { openid } = ctx.state.userInfo;
    const { type, topicId, commentId } = ctx.request.body;

    // 判断点赞类型
    if (type === TOPIC && topicId) {
      // 题目
      // 判断题目是否存在
      const topic = await ctx.service.topic.checkTopic({ value: topicId });
      if (!topic) {
        throw new BadRequestException('题目不存在');
      }

      // 判断是否已经点赞或者点踩
      const exist = await ctx.service.likeStatus.checkLikeStatus({ userId: openid, topicId, type: TOPIC });

      if (exist) {
        // 已经点赞或者点踩 执行删除
        await ctx.service.likeStatus.deleteLikeStatus({ userId: openid, topicId, type: TOPIC });
      } else {
        throw new BadRequestException('未点赞');
      }
    }

    // TODO: 滞后开发
    if (type === COMMENT && commentId) {
      // 评论
      // 判断评论是否存在
    }

    ctx.body = '';
  }
}

module.exports = LikeStatusController;
