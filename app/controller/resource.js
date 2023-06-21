/**
 * 资源模块
 */

const Controller = require('egg').Controller;
const BadRequestException = require('../exception/badRequest');

class ResourceController extends Controller {
  /**
   * 上传文件
   */
  async add() {
    const { ctx } = this;
    const body = ctx.request.body;
    body.userId = ctx.state.userInfo.openid;
    verifyData(body, ctx);
    // 默认为不通过
    body.status = 0;
    const result = await ctx.service.resource.add(body);
    ctx.body = result;
  }

  /**
   * 资源列表
   */
  async list() {
    const { ctx } = this;
    const { pageNum = 1, pageSize = 10, categoryId, status, startTime, endTime } = ctx.query;
    const params = { pageNum, pageSize, categoryId, status, startTime, endTime };
    const result = await ctx.service.resource.list(params);
    ctx.body = result;
  }

  /**
   * 资源详情
   */
  async detail() {
    const { ctx } = this;
    const { resourceId } = ctx.params;
    if(!resourceId) {
      throw new BadRequestException('资源id必传');
    }
    const result = await ctx.service.resource.detail(resourceId);
    ctx.body = result;
  }

  /**
   * 资源更新
   */
  async update() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { id } = body;
    body.userId = ctx.state.userInfo.openid;
    if(!id) {
      throw new BadRequestException('资源id必传');
    }
    verifyData(body, ctx);
    await ctx.service.resource.update(id, body);
    ctx.body = {};
  }
}

/**
 * 验证数据
 */
function verifyData(data, ctx) {
  const { userId, title, categoryId, desc, resourceUrl, resourcePwd, score, price, saleType } = data;
  if(!userId) {
    throw new BadRequestException('确认是否登录');
  }
  if(!title){
    throw new BadRequestException('标题必传');
  }
  if(!desc) {
    throw new BadRequestException('描述必传');
  }
  if(!categoryId){
    throw new BadRequestException('分类必传');
  }
  if(!resourceUrl){
    throw new BadRequestException('资源地址必传');
  }
  if(!resourcePwd){
    throw new BadRequestException('资源密码必传');
  }
  if([null, undefined, ''].includes(score)){
    throw new BadRequestException('资源积分必传');
  }
  if([null, undefined, ''].includes(price)){
    throw new BadRequestException('资源价格必传');
  }
  if(!saleType && [1, 2].includes(saleType)){
    throw new BadRequestException('兑换类型必传');
  }
}


module.exports = ResourceController;