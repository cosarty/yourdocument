export const QUESTION_TYPE_ENUM = {
  0: '判断题', 1: '单选题', 2: '多选题', 3: '简答题'
};

export const QUESTION_DIFFICULTY_ENUM = {
  0: '简单',
  1: '中等',
  2: '困难',
};

export const QUESTION_DIFFICULTY_COLOR_ENUM = {
  0: '#00AF9B',
  1: '#FFB800',
  2: '#FF2D55',
};


export const REVIEW_STATUS_ENUM = {
  REVIEWING: 1,
  PASS: 2,
  REJECT: 3,
};

export const REVIEW_STATUS_MAP = {
  1: '审核中',
  2: '已发布',
  3: '拒绝',
};

export const REVIEW_STATUS_MAP_INFO = {
  1: {
    text: '审核中',
    color: 'blue',
  },
  2: {
    text: '已发布',
    color: 'green',
  },
  3: {
    text: '拒绝',
    color: 'red',
  },
};
