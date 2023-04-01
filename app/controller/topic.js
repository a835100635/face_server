'use strict';

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');
const { CHECK_TYPE } = require('../../constants/index');

class TopicController extends Controller {
  /**
   * 新增题目
   */
  async add() {
    const { ctx } = this;
    verifyTopicData(ctx.request.body, ctx);
    const topicData = await ctx.service.topic.checkTopic({ value: ctx.request.body.topic, filed: 'topic' });
    if (topicData) {
      throw new BadRequestException('题目已存在');
    }
    let { categoryId, topic, level, type, answer, options, correct, desc } = ctx.request.body;
    options = JSON.stringify(options);
    const result = await ctx.service.topic.add({
      categoryId, topic, level, type, answer, options, correct, desc,
      online: 0,
      status: 0,
      like: 0,
      dislike: 0,
    });
    result.dataValues.options = JSON.parse(result.dataValues.options);
    ctx.body = result.dataValues;
  }

  /**
   * 删除题目
   */
  async delete() {
    const { ctx } = this;
    const { topicId } = ctx.params;
    await ctx.service.topic.checkTopic({ value: topicId, filed: 'id' });
    const result = await ctx.service.topic.delete(topicId);
    if (!result.length) {
      throw new BadRequestException('删除失败');
    }
    ctx.body = null;
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
    const topicData = await ctx.service.topic.checkTopic({ value: id.topic });
    if (topicData) {
      throw new BadRequestException('题目已存在');
    }
    verifyTopicData(ctx.request.body, ctx);
    options = JSON.stringify(options);
    const result = await ctx.service.topic.update({
      id, categoryId, topic, level, type, answer, options, correct, desc,
    });
    if (!result.length) {
      throw new BadRequestException('更新失败');
    }
    const newTopic = await ctx.service.topic.checkTopic({ value: id });
    ctx.body = newTopic;
  }

  /**
   * 获取题目
   */
  async topic() {
    const { ctx } = this;
    // checkType 0 题目 1 考试 2 完整
    const { topicId } = ctx.params;
    const { checkType = CHECK_TYPE.READ } = ctx.query;
    if (!topicId) {
      throw new BadRequestException('缺少题目id');
    }
    const topic = await ctx.service.topic.topic({ topicId, checkType });
    ctx.body = topic;
  }

  /**
   * 获取题目列表
   */
  async list() {
    const { ctx } = this;
    const { categoryId, pageNum = 1, pageSize = 10 } = ctx.query;
    const field = [ 'categoryId', 'topic', 'level', 'type', 'answer', 'online', 'status',
      'createUser', 'updatedTime', 'pageNum', 'pageSize', 'startTime', 'endTime', 'detail' ];
    const keys = Object.keys(ctx.query);
    keys.forEach(key => {
      if (!field.includes(key)) {
        throw new BadRequestException(`${key} 参数错误`);
      }
    });
    if (categoryId) {
      await ctx.service.category.checkCategory({ value: categoryId });
    }
    const isKey = [ 'categoryId', 'topic', 'level', 'type', 'answer', 'online', 'status', 'createUser', 'updatedTime', 'startTime', 'endTime', 'detail' ];
    const condition = isKey.reduce((pre, item) => {
      if (ctx.query[item]) pre[item] = ctx.query[item];
      return pre;
    }, {});
    const result = await ctx.service.topic.list(condition, { pageNum, pageSize });
    ctx.body = result;
  }

}

/**
 * 验证题目数据
 * @param {*} topicData 参数
 * @param {*} ctx 上下文
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
