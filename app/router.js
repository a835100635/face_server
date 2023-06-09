'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, logger, config } = app;
  const { apiPrefix } = config;

  app.beforeStart(async function () {
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

  // 登录
  router.post(`${apiPrefix}/api/login`, controller.user.login);
  // 用户
  router.post(`${apiPrefix}/api/user`, controller.user.updateUserInfo);

  // 分类
  router.post(`${apiPrefix}/api/category`, controller.category.add);
  router.delete(`${apiPrefix}/api/category/:categoryId`, controller.category.delete);
  router.put(`${apiPrefix}/api/category`, controller.category.update);
  router.get(`${apiPrefix}/api/category`, controller.category.category);
  // 题目
  router.post(`${apiPrefix}/api/topic`, controller.topic.add);
  router.delete(`${apiPrefix}/api/topic/:topicId`, controller.topic.delete);
  router.put(`${apiPrefix}/api/topic`, controller.topic.update);
  router.get(`${apiPrefix}/api/topic`, controller.topic.list);
  router.get(`${apiPrefix}/api/topic/:topicId`, controller.topic.topic);
  // 评论
  router.post(`${apiPrefix}/api/comment`, controller.comment.add);

  // 题目、评论点赞点踩
  router.post(`${apiPrefix}/api/topic/like`, controller.likeStatus.like);
  // 题目、评论取消点赞点踩
  router.post(`${apiPrefix}/api/topic/unlike`, controller.likeStatus.unlike);

  // 上传文件
  router.post(`${apiPrefix}/api/upload`, controller.uploadFiles.upload);
  // 删除文件
  router.post(`${apiPrefix}/api/common/deleteFile`, controller.uploadFiles.delete);

  // 个人积分日志
  router.get(`${apiPrefix}/api/scoreLog`, controller.user.scoreLogList);
  // 获取积分
  router.post(`${apiPrefix}/api/changeScore`, controller.user.changeScore);
  // 积分类型列表
  router.get(`${apiPrefix}/api/integrationType/list`, controller.integrationType.index);
  // 积分类型添加
  router.post(`${apiPrefix}/api/integrationType/add`, controller.integrationType.add);
  // 积分类型更新
  router.post(`${apiPrefix}/api/integrationType/update`, controller.integrationType.update);
  // 积分类型删除
  router.post(`${apiPrefix}/api/integrationType/delete`, controller.integrationType.delete);

  // 新增资源
  router.post(`${apiPrefix}/api/resource`, controller.resource.add);
  // 资源列表
  router.get(`${apiPrefix}/api/resource`, controller.resource.list);
  // 资源详情
  router.get(`${apiPrefix}/api/resource/:resourceId`, controller.resource.detail);
  // 资源更新
  router.post(`${apiPrefix}/api/resource/update`, controller.resource.update);

};
