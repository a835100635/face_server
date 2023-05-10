/**
 * 积分类型控制器
 */

const BadRequestException = require('../exception/badRequest');

const Controller = require('egg').Controller;
class IntegrationTypeController extends Controller {
  async index() {
    const { ctx } = this;
    const types = await ctx.service.integrationType.list();
    ctx.body = types;
  }

  // 添加积分类型
  async add() {
    const { ctx } = this;
    const { label, type, score, rate } = ctx.request.body;
    console.log(label, type, score, rate);
    if (!label || !type || !score || !rate) {
      throw new BadRequestException('参数错误');
    }
    const result = await ctx.service.integrationType.add({ label, type, score, rate });
    ctx.body = result;
  }

  // 更新
  async update() {
    const { ctx } = this;
    const { id, label, type, score, rate } = ctx.request.body;
    if (!id || !label || !type || !score || !rate) {
      throw new BadRequestException('参数错误');
    }
    const result = await ctx.service.integrationType.update({ id, label, type, score, rate });
    ctx.body = result;
  }

  // 删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      throw new BadRequestException('参数错误');
    }
    const result = await ctx.service.integrationType.delete(id);
    ctx.body = result;
  }
}

module.exports = IntegrationTypeController;