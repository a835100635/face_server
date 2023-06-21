/**
 * 分类服务
 */
const { Service } = require('egg');
const { Op } = require('sequelize');
const { CHECK_TYPE, LIKE_STATUS } = require('../../constants/index');
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
    const { ctx, app } = this;
    const sequelize = app.Sequelize;
    const { literal } = sequelize;
    const { READ, TEST, ALL } = CHECK_TYPE;
    const { openid } = ctx.state.userInfo;
    const { LIKE, DISLIKE } = LIKE_STATUS;
    const publicAttr = ['id', 'categoryId', 'topic', 'topicDesc', 'level'];
    const attributesMap = {
      // 阅读模式  需要选项
      [`${READ}`]: publicAttr.concat(['answer']),
      // 考试模式 不需要解析
      [`${TEST}`]: publicAttr.concat(['options', 'type']),
    };
    const attributes = checkType == ALL ? [].concat(attributesMap[READ], attributesMap[TEST]) : attributesMap[checkType];
    const result = await ctx.model.Topic.findOne({
      attributes: [
        ...attributes,
        // literal 可加入自定义sql
        // 查询点赞数量 LIKE+题目
        [literal(`(select count(status) from LikeStatus where status = '${LIKE}' and topic_id = '${topicId}')`), 'likeCount'],
        // 查询点踩数量 DISLIKE+题目
        [literal(`(select count(status) from LikeStatus where status = '${DISLIKE}' and topic_id = '${topicId}')`), 'dislikeCount'],
        // 查询是否点赞 LIKE+用户+题目
        [
          literal(`(
            select status from LikeStatus where status = '${LIKE}' and user_id = '${openid}' and topic_id = '${topicId}'
          )`), 
          'isLike'
        ],
        // 查询是否点踩 DISLIKE+用户+题目
        [
          literal(`(
            select status from LikeStatus where status = '${DISLIKE}' and user_id = '${openid}' and topic_id = '${topicId}'
          )`), 
          'isDislike'
        ],
      ],
      where: {
        id: topicId,
      },
      include: [
        {
          model: ctx.model.LikeStatus,
          // 设置关联查询的字段 为空时只会查询数量
          attributes: [],
        },
      ],
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
        [Op.between]: [startTime, endTime],
      };
    }

    const attributes = ['id', 'categoryId', 'topic'];
    if (isDetail == 1) {
      attributes.push('level', 'type', 'answer', 'topicDesc', 'online', 'status', 'options', 'correct', 'createdTime', 'updatedTime', 'desc');
    }

    const result = await ctx.model.Topic.findAndCountAll({
      attributes,
      where,
      limit: +pageSize,
      offset: (+pageNum - 1) * +pageSize,
    });
    const { count, rows } = result;
    return {
      total: count,
      data: rows,
      pageNum,
      pageSize,
    };
  }

}

module.exports = TopicService;
