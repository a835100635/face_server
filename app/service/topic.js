/**
 * 分类服务
 */
const { Service } = require('egg');
const BadRequestException = require('../exception/badRequest');

class TopicService extends Service {
  /**
   * 新增题目
   * @param body
   */
  async add(body) {
    const result = await this.ctx.model.Topic.create(body);
    return result;
  }

  /**
   * 删除题目
   * @param { Number } topicId 题目id
   */
  async delete(topicId) {
    const { ctx } = this;
    const result = await ctx.model.Topic.destroy({
      where: {
        id: topicId,
      },
    });
    return result;
  }

  /**
   * 更新题目
   * @param data
   */
  async update(data) {
    const { ctx } = this;
    const result = await ctx.model.Topic.update(data, {
      where: {
        id: data.id,
      },
    });
    return result;
  }

  /**
   * 校验题目是否存在
   * @param {Object} param 参数
   * @param {String|Number} param.value 题目值
   * @param {String} param.filed 具体字段
   */
  async checkTopic({ value, filed = 'id' }) {
    const result = await this.ctx.model.Topic.findOne({
      where: {
        [filed]: value,
      },
    });
    if (!result) {
      throw new BadRequestException('题目不存在');
    }
    result.dataValues.options = JSON.parse(result.dataValues.options);
    return result;
  }
}

module.exports = TopicService;
