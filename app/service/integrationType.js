/**
 * IntegrationType Service
 */

const Service = require('egg').Service;

class IntegrationTypeService extends Service {
  async list() {
    const { ctx } = this;
    try {
      const types = await ctx.model.ScoreType.findAll({
        // 倒序排列
        order: [['id', 'DESC']],
      });
      return types;
    } catch (error) {
      throw new ServiceError('获取失败');
    }
  }

  async add({ label, type, score, rate }) {
    const { ctx } = this;
    const result = await ctx.model.ScoreType.create({ label, type, score, rate });
    return result;
  }

  async update({ id, label, type, score, rate }) {
    const { ctx } = this;
    try {
      const result = await ctx.model.ScoreType.update({ label, type, score, rate }, {
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw new ServiceError('更新失败');
    }
  }

  async delete(id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.ScoreType.destroy({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw new ServiceError('删除失败');
    }
  }

}

module.exports = IntegrationTypeService;
