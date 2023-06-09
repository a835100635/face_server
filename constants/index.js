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
  // 分类类型
  CATEGORY_TYPES: {
    // 前端
    FRONT_END: {
      label: '前端',
      value: 1,
    },
    // 后端
    BACK_END: {
      label: '后端',
      value: 2,
    },
    // 测试
    TEST: {
      label: '测试',
      value: 3,
    },
    // 数据库
    DATABASE: {
      label: '数据库',
      value: 4,
    },
    // 云计算
    CLOUD_COMPUTING: {
      label: '云计算',
      value: 5,
    },
    // 运维
    OPERATION_AND_MAINTENANCE: {
      label: '运维',
      value: 6,
    },
    // 大数据
    BIG_DATA: {
      label: '大数据',
      value: 7,
    },
    // 人工智能
    ARTIFICIAL_INTELLIGENCE: {
      label: '人工智能',
      value: 8,
    },
    // 区块链
    BLOCK_CHAIN: {
      label: '区块链',
      value: 9,
    },
    // 物联网
    INTERNET_OF_THINGS: {
      label: '物联网',
      value: 10,
    },
    // 游戏开发
    GAME_DEVELOPMENT: {
      label: '游戏开发',
      value: 11,
    },
    // 安全
    SECURITY: {
      label: '安全',
      value: 12,
    },
    // 资源
    RESOURCE: {
      label: '资源',
      value: 13,
    },
    // 资讯
    INFORMATION: {
      label: '资讯',
      value: 14,
    },
    // 其他
    OTHER: {
      label: '其他',
      value: -1,
    },
  }
};
