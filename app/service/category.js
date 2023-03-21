/**
 * 分类服务
 */
const { Service } = require('egg');
const BadRequestException = require('../exception/badRequest');

class CategoryService extends Service {
  /**
   * 新增分类
   * @param {*} body { typeId, categoryName }
   * @return {*} 新增的数据
   */
  async add(body) {
    const result = await this.ctx.model.Category.create(body);
    return result;
  }

  /**
   * 删除分类
   * @param {String} categoryId 分类id
   */
  async delete(categoryId) {
    await this.ctx.model.Category.destroy({
      where: {
        categoryId,
      },
    });
  }

  /**
   * 更新分类
   * @param {Object} body 分类信息
   * @return { Object } 更新后的分类
   */
  async updated(body) {
    const { categoryId } = body;
    const result = await this.ctx.model.Category.update(body, {
      where: {
        categoryId,
      },
    });
    if (!result) {
      throw new BadRequestException('更新失败');
    }
    return this.checkCategory({ value: categoryId });
  }

  /**
   * 查找分类
   * @param { Object } params { value, field: categoryName | categoryId }
   */
  async checkCategory({ value, field = 'categoryId' }) {
    const result = await this.ctx.model.Category.findOne({
      where: {
        [field]: value,
      },
    });
    return result;
  }

  /**
   * 获取分类
   */
  async category() {
    const result = await this.ctx.model.Category.findAll({
      attributes: [ 'categoryId', 'typeId', 'categoryName' ],
    });
    return result;
  }

}

module.exports = CategoryService;
