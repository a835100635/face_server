/**
 * 分类控制器
 */

const { Controller } = require('egg');
const BadRequestException = require('../exception/badRequest');
const { CATEGORY_TYPES } = require('../../constants/index');

class CategoryController extends Controller {
  /**
   * 新增
   */
  async add() {
    const { ctx } = this;
    const { typeId, categoryName } = ctx.request.body;
    if (!(['string', 'number'].includes(typeof typeId)) && !categoryName) {
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
    const category = await ctx.service.category.checkCategory({ value: categoryId, field: 'id' });
    if (!category) {
      throw new BadRequestException(`“${categoryId}” 分类不存在`);
    }
    // 判断是否有关联
    const { typeId } = category;
    // 资源
    if(typeId === CATEGORY_TYPES.RESOURCE.value) {
      const resourceCount = await ctx.service.resource.countByCategory(categoryId);
      if (resourceCount) {
        throw new BadRequestException(`“${category.categoryName}”分类下有资源，不能删除`);
      }
    }

    await ctx.service.category.delete(categoryId);
    ctx.body = {};
  }

  /**
   * 更新
   */
  async update() {
    const { ctx } = this;
    const { typeId, categoryName, id } = ctx.request.body;
    if (!categoryName || !id || !(['string', 'number'].includes(typeof typeId))) {
      throw new BadRequestException('id 与 typeId、categoryName必传');
    }
    const category = await ctx.service.category.checkCategory({ value: id });
    if (!category) {
      throw new BadRequestException(`“${categoryName}”分类不存在`);
    }
    if (category.categoryName === categoryName && category.id != id) {
      throw new BadRequestException(`“${categoryName}”分类名称已存在`);
    }
    const result = await ctx.service.category.updated(ctx.request.body);
    ctx.body = result;
  }

  /**
   * 查询
   */
  async category() {
    const { ctx } = this;
    const { typeId, exclude } = ctx.query;
    const excludeIds = exclude && (JSON.parse(exclude) || '[]');
    const result = await ctx.service.category.category(typeId, excludeIds);
    const categoryMap = {};

    result.forEach(c => {
      if (!categoryMap[`${c.typeId}`]) {
        categoryMap[`${c.typeId}`] = [];
      }
      categoryMap[c.typeId].push(c);
    });
    ctx.body = categoryMap;
  }

}

module.exports = CategoryController;
