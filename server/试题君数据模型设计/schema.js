const userSchema = {
  avtarUrl: String, // 头像
  favourQuestionIds: [ObjectId], // 收藏id
  gender: String, //性别
  isBan: Boolean, // 是否封号
  nickName: String, //昵称
  _createTime: String,
  _updateTime: String,
  profile: String, // 个人简介
  email: String, //邮箱
  organize: [], // 加入的组织
  auth: String, //  user admin super
};
// 注册要填写 邮箱  性别 昵称  密码

const commentSchema = {
  userId: String, // 用户id
  questionId: String, // 问题id
  content: String, // 回答内容
  thumbNum: String, // 点赞
  replyList: [
    {
      commentId: String, // 评论id
      content: String, // 评论内容
      isDelete: false, // 是否删除
      questionId: Object.id, // 问题id
      userId: Object.id, // 用户id
      userInfo: Object,
    },
  ], // 回复列表
  userInfo: Object, // 用户信息
  _createTime: Date,
  _updateTime: Date,
  isDelete: Boolean,
};

// 短信验证码
const authCodeSchema = {
  expireTime: Date, // 过期时间
  email: String,
  captcha: String, // 验证码
};

// 题目信息
const questionsSchema = {
  difficulty: Number, // 难度
  title: String,
  commentNum: Number, //  回答数
  detail: String, // 题目详情
  favourNum: Number, // 收藏人数
  isDelete: Boolean, // 是否删除
  params: {
    // 可选项  如果是多选或者单选 才填入
    // 题目选项
    answer: 'A',
    options: {
      A: '...',
      B: '...',
      C: '...',
      D: '...',
    },
  },
  grade: Number,
  reviewStatus: Number, //  审核状态 1 2 3
  reviewTime: Date, // 审核时间
  reviewMessage: String, // 审核信息
  tags: [], // 标签
  type: Number, //题目类型 0 1 2 3
  userId: Object.id, // 用户id
  viewNum: Number, // 点击人数
};

// 消息信息
const messageSchema = {
  content: String, //内容
  toUserId: Object.Id, // 发送者
  isDelete: Boolean,
  readTime: Date, // 读取时间
  status: 1,
  title: '回复标题',
  // type: 0,
  _createTime: '2022-08-03T09:39:08.766Z',
  _updateTime: '2022-08-03T09:42:58.313Z',
};

// 组织信息
const organizeSchema = {};

// 试卷信息
const paperSchema = {
  name: String,
  detail: String,
  questions: String,
  viewNum: Number,
  // tags: String[],
  userId: String, // 创建者
  publishTime: Date,
  questions: [], // 题目
  _createTime: Date,
  _updateTime: Date,
  organize: Object.id, // 所属组织
  completeNum: Object.id, //人数
  gross: Number, // 总分
};

// 分类信息
const tagsSchema = {
  name: String,
  tags: [String], // 标签
};

//错题本
const wrongTopic = {};
