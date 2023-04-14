/**
 * 分类服务
 */
const { Service } = require('egg');
const BadRequestException = require('../exception/badRequest');
const Topic = require('../model/topic');

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
    const { ctx, app } = this;
    const { Category, Topic } = ctx.model;
    const result = await Category.findAll({
      attributes: [ 'id', 'typeId', 'categoryName',
        // 查询关联表的数量 
        [app.Sequelize.literal(`(SELECT COUNT(*) FROM Topic WHERE \`Topic\`.\`category_id\`  = \`Category\`.\`id\`)`), 'topicCount']
      ],
      include: [
        {
          model: Topic,
          // 设置关联查询的字段 为空时只会查询数量
          attributes: [],
        },
      ],
      group: ['Category.id']
    });
    return result;
  }

}

module.exports = CategoryService;
