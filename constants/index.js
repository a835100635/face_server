// 题目查看类型
module.exports = {
  CHECK_TYPE: {
    // 查看
    READ: 0,
    // 考试
    TEST: 1,
    // 完整
    ALL: 2,
  },
  // 枚举类型，表示实体类型
  LIKE_ENTITY_TYPES: {
    TOPIC: 'topic', // 题目
    COMMENT: 'comment', // 评论
  },
  // 点赞状态
  LIKE_STATUS: {
    LIKE: 'LIKE', // 点赞
    DISLIKE: 'DISLIKE', // 点踩
  },
  // 积分日志类型
  SCORE_LOG_TYPES: {
    // 签到
    SIGN_IN: 1,
    // 发表题目
    TOPIC: 2,
    // 上传资源
    UPLOAD: 2,
    // 考试
    TEST: 1,
  },

};
