/**
 * 点赞
 */

const { Service } = require('egg');

class LikeStatusService extends Service {

  /**
   * 检查点赞状态
   * @param {*} param0
   * @return
   */
  checkLikeStatus({ userId, topicId, type }) {
    const { ctx } = this;
    const likeStatus = ctx.model.LikeStatus.findOne({
      where: {
        userId,
        topicId,
        type,
      },
    });
    return likeStatus;
  }

  /**
   * 删除点赞状态
   * @param root0
   * @param root0.userId
   * @param root0.topicId
   * @param root0.type
   * @param root0.status
   */
  async deleteLikeStatus({ userId, topicId, type }) {
    const { ctx } = this;
    const likeStatus = await ctx.model.LikeStatus.destroy({
      where: {
        userId,
        topicId,
        type,
      },
    });
    if (!likeStatus) {
      throw new Error('删除点赞状态失败');
    }
    return likeStatus;
  }

  /**
   * 添加点赞状态
   * @param root0
   * @param root0.userId
   * @param root0.topicId
   * @param root0.type
   * @param root0.status
   */
  addLikeStatus({ userId, topicId, type, status }) {
    const { ctx } = this;
    const likeStatus = ctx.model.LikeStatus.create({
      userId,
      topicId,
      type,
      status,
    });
    if (!likeStatus) {
      throw new Error('添加点赞状态失败');
    }
    return likeStatus;
  }
  /**
   * 更新点赞状态
   * @param {*} param0
   * @return
   */
  updateLikeStatus({ userId, topicId, type, status }) {
    const { ctx } = this;
    const likeStatus = ctx.model.LikeStatus.update({
      status,
    }, {
      where: {
        userId,
        topicId,
        type,
      },
    });
    if (!likeStatus) {
      throw new Error('更新点赞状态失败');
    }
    return likeStatus;
  }
}

module.exports = LikeStatusService;
