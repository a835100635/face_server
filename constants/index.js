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
};
