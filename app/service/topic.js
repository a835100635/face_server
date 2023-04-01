/**
 * 分类服务
 */
const { Service } = require('egg');
const { Op } = require('sequelize');
const { CHECK_TYPE } = require('../../constants/index');
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
   * 获取题目
   * @param { String } topicId 题目id
   * @param { Number } checkType 查看类型
   */
  async topic({ topicId, checkType }) {
    const { READ, TEST, ALL } = CHECK_TYPE;
    const publicAttr = [ 'id', 'categoryId', 'topic', 'level' ];
    const attributesMap = {
      [`${READ}`]: publicAttr.concat([ 'answer', 'like', 'dislike' ]),
      [`${TEST}`]: publicAttr.concat([ 'options', 'type', 'correct' ]),
    };
    console.log('==', checkType, attributesMap[checkType]);
    const attributes = checkType == ALL ? [].concat(attributesMap[READ], attributesMap[TEST]) : attributesMap[checkType];
    const result = await this.ctx.model.Topic.findOne({
      attributes,
      where: {
        id: topicId,
      },
    });
    if (!result) {
      throw new BadRequestException('题目不存在');
    }
    if (result.dataValues.options) {
      result.dataValues.options = JSON.parse(result.dataValues.options);
    }
    return result;
  }

  /**
   * 校验题目是否存在/获取题目
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
    if (result) {
      result.dataValues.options = JSON.parse(result.dataValues.options);
    }
    return result;
  }

  /**
   * 获取题目列表
   * @param {*} params 参数
   * @param root0
   * @param root0.pageNum
   * @param root0.pageSize
   * @return {*}
   */
  async list(params, { pageNum, pageSize }) {
    const { ctx } = this;
    const topicName = params.topic || '';
    const startTime = params.startTime || '';
    const endTime = params.endTime || '';
    const isDetail = params.detail || false;
    delete params.topic;
    delete params.startTime;
    delete params.endTime;
    delete params.detail;

    const where = { ...params };
    if (topicName) {
      where.topic = {
        [Op.like]: `%${topicName}%`,
      };
    }
    if (startTime && endTime) {
      where.createdTime = {
        [Op.between]: [ startTime, endTime ],
      };
    }

    const attributes = [ 'id', 'categoryId', 'topic' ];
    if (isDetail == 1) {
      attributes.push('level', 'type', 'answer', 'online', 'status', 'options', 'correct', 'createdTime');
    }

    const result = await ctx.model.Topic.findAndCountAll({
      attributes,
      where,
      limit: +pageSize,
      offset: (+pageNum - 1) * +pageSize,
    });
    if (result && result.rows && isDetail == 1) {
      result.rows.forEach(item => {
        item.dataValues.options = JSON.parse(item.dataValues.options);
      });
    }
    const { count, rows } = result;
    return {
      data: {
        total: count,
        data: rows,
        pageNum,
        pageSize,
      },
    };
  }

}

module.exports = TopicService;
