'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, logger } = app;

  app.beforeStart(async function() {
    logger.info('app beforeStart--->');
    // 开发环境使用，会删除数据表 force  false 为不覆盖 true会删除再创建
    await app.model.sync({
      force: false,
      // alter=true可以 添加或删除字段
      alter: true,
    }).then(() => {
      logger.info('Database connection is successful --->');
    }).catch(error => {
      logger.info('Database connection is fails --->', error);
    });
  });

  router.post('/api/category', controller.category.add);
  router.delete('/api/category/:categoryId', controller.category.delete);
  router.put('/api/category', controller.category.update);
  router.get('/api/category', controller.category.category);

  router.post('/api/topic', controller.topic.add);
  router.delete('/api/topic/:topicId', controller.topic.delete);
  router.put('/api/topic', controller.topic.update);
  router.get('/api/topic/:topicId', controller.topic.topic);
};
