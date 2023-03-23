'use strict';

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');

class TopicController extends Controller {
  /**
   * 新增题目
   */
  async add() {
    const { ctx } = this;
    verifyTopicData(ctx.request.body, ctx);
    const topicExist = await ctx.service.topic.checkTopic({ value: ctx.request.body.topic, filed: 'topic' });
    if (topicExist) {
      throw new BadRequestException('题目已存在');
    }
    let { categoryId, topic, level, type, answer, options, correct, desc } = ctx.request.topicData;
    options = JSON.stringify(options);
    const result = await ctx.service.topic.add({
      categoryId, topic, level, type, answer, options, correct, desc,
      online: 0,
      status: 0,
      like: 0,
      dislike: 0,
    });
    result.options = JSON.parse(result.options);
    ctx.body = result;
  }

  /**
   * 删除题目
   */
  async delete() {
    const { ctx } = this;
    const { topicId } = ctx.params;
    const topicExist = await ctx.service.topic.checkTopic({ value: topicId, filed: 'id' });
    if (!topicExist) {
      throw new BadRequestException('题目不存在');
    }
    const result = await ctx.service.topic.delete(topicId);
    ctx.body = result;
  }

  /**
   * 更新题目
   */
  async update() {
    const { ctx } = this;
    let { id, categoryId, topic, level, type, answer, options, correct, desc } = ctx.request.body;
    if (!id) {
      throw new BadRequestException('题目id必传');
    }
    const topicExist = await ctx.service.topic.checkTopic({ value: id });
    if (!topicExist) {
      throw new BadRequestException('题目不存在');
    }
    verifyTopicData(ctx.request.body, ctx);
    options = JSON.stringify(options);
    const result = await ctx.service.topic.update({
      id, categoryId, topic, level, type, answer, options, correct, desc,
    });
    result.options = JSON.parse(result.options);
    ctx.body = result;
  }
}

/**
 * 验证题目数据
 * @param {*} topicData
 * @param {*} ctx
 */
function verifyTopicData(topicData, ctx) {
  const { categoryId, topic, level, type, answer, options, correct } = topicData;
  const category = ctx.service.category.checkCategory({ value: categoryId });
  if (!category) {
    throw new BadRequestException('分类不存在');
  }
  if (!topic) {
    throw new BadRequestException('题目必传');
  }
  if (!level || (level < 1 || level > 5) || level % 1 !== 0) {
    throw new BadRequestException('level值为1-5整数区间');
  }
  if (!type || (type < 1 || type > 4) || type % 1 !== 0) {
    throw new BadRequestException('type类型不准确');
  }
  if ([ 2, 4 ].includes(type) && !answer) {
    throw new BadRequestException('填空题、开放题答案必传');
  }
  const kl = Object.keys(options);
  if ([ 1, 3 ].includes(type) && (!kl.length || kl.length < 2)) {
    if (!options[correct]) {
      throw new BadRequestException('答案不在选项中');
    }
    throw new BadRequestException('选项必传且选项必须2个及以上');
  }
}


module.exports = TopicController;
