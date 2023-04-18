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
    if (!result) {
      throw new BadRequestException('新增失败');
    }
    return {
      ...result.dataValues,
      topicCount: 0,
    };
  }

  /**
   * 删除分类
   * @param {String} id 分类id
   */
  async delete(id) {
    await this.ctx.model.Category.destroy({
      where: {
        id
      },
    });
  }

  /**
   * 更新分类
   * @param {Object} body 分类信息
   * @return { Object } 更新后的分类
   */
  async updated(body) {
    const { id } = body;
    const result = await this.ctx.model.Category.update(body, {
      where: {
        id,
      },
    });
    if (!result) {
      throw new BadRequestException('更新失败');
    }
    return this.checkCategory({ value: id });
  }

  /**
   * 查找分类
   * @param { Object } params { value, field: categoryName | id }
   */
  async checkCategory({ value, field = 'id' }) {
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
      attributes: [ 'id', 'typeId', 'categoryName', 'desc',
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
