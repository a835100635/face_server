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
    SIGN_IN: {
      label: '签到',
      rate: 1,
      score: 1
    },
    // 发表题目
    TOPIC: {
      label: '发表题目',
      rate: 1,
      score: 2
    },
    // 上传资源
    UPLOAD: {
      label: '上传资源',
      rate: 1,
      score: 2
    },
    // 考试
    TEST: {
      label: '考试',
      rate: 1,
      score: 1
    },
  },

};
