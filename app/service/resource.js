/**
 * 资源模块
 */

const Service = require('egg').Service;
const ServiceError = require('../exception/serviceError');

class ResourceService extends Service {
  /**
   * 新增资源
   * @param {*} body 
   * @returns 
   */
  async add(body) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Resource.create(body);
      return result;
    } catch (error) {
      throw new ServiceError('资源上传失败')
    }
  }

  /**
   * 列表
   * @param {*} param0 
   * @returns 
   */
  async list({ pageNum, pageSize, categoryId, status, startTime, endTime }) {
    const { ctx } = this;
    const { Op } = this.app.Sequelize;
    const where = {};
    if(categoryId) {
      where.categoryId = categoryId;
    }
    if(status) {
      where.status = status;
    }
    if(startTime && endTime) {
      where.createdTime = {
        [Op.between]: [startTime, endTime],
      };
    }
    const result = await ctx.model.Resource.findAndCountAll({
      where,
      attributes: ['id', 'title', 'categoryId', 'resourceUrl', 'resourcePwd', 'score', 'price', 'saleType', 'status', 'createdTime'],
      order: [['createdTime', 'DESC']],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    });
    const { count, rows } = result;
    return {
      total: count,
      data: rows,
      pageNum,
      pageSize,
    };
  }

  /**
   * 详情
   */
  async detail(id) {
    const { ctx } = this;
    const result = await ctx.model.Resource.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      throw new ServiceError('资源不存在');
    }
    return result;
  }

  /**
   * 更新
   */
  async update(id, body) {
    const { ctx } = this;
    const result = await ctx.model.Resource.update(body, {
      where: {
        id,
      },
    });
    if (!result) {
      throw new ServiceError('资源更新失败');
    }
    return {};
  }
}

module.exports = ResourceService;