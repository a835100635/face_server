/**
 * 分类控制器
 */

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');
// const NotFoundException = require('../exception/notFoundException');

class CategoryController extends Controller {
  /**
   * 新增
   */
  async add() {
    const { ctx } = this;
    const { typeId, categoryName } = ctx.request.body;
    if (!([ 'string', 'number' ].includes(typeof typeId)) && !categoryName) {
      throw new BadRequestException('参数错误');
    }
    // 判断名称是否重复
    const category = await ctx.service.category.checkCategory({ value: categoryName, field: 'categoryName' });
    if (category) {
      throw new BadRequestException(`“${categoryName}”分类名称已存在`);
    }
    const result = await ctx.service.category.add(ctx.request.body);
    ctx.body = result;
  }

  /**
   * 删除
   */
  async delete() {
    const { ctx } = this;
    const { categoryId } = ctx.params;
    if (!categoryId) {
      throw new BadRequestException('缺少分类id');
    }
    // 判断是否存在
    const category = await ctx.service.category.checkCategory({ value: categoryId, field: 'categoryId' });
    if (!category) {
      throw new BadRequestException(`“${categoryId}” 分类不存在`);
    }
    await ctx.service.category.delete(categoryId);
    ctx.body = '';
  }

  /**
   * 更新
   */
  async updated() {
    const { ctx } = this;
    const { typeId, categoryName, categoryId } = ctx.request.body;
    if (!categoryName || !categoryId || !([ 'string', 'number' ].includes(typeof typeId))) {
      throw new BadRequestException('categoryId 与 typeId、categoryName必传');
    }
    const category = await ctx.service.category.checkCategory({ value: categoryId });
    if (!category) {
      throw new BadRequestException(`“${categoryName}”分类不存在`);
    }
    if (category.categoryName === categoryName && category.categoryId != categoryId) {
      throw new BadRequestException(`“${categoryName}”分类名称已存在`);
    }
    const result = await ctx.service.category.updated(ctx.request.body);
    ctx.body = result;
  }

}

module.exports = CategoryController;
