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
  auth: String, //  user admin super
};
// 注册要填写 邮箱  性别 昵称  密码

const commentSchema = {
  user: String, // 用户id
  questionId: String, // 问题id
  content: String, // 回答内容
  priority: Number, // 优先级
  // thumbNum: String, // 点赞
  userInfo: Object, // 用户信息
  isDelete: Boolean,
};
const replySchema = {
  commentId: String, // 评论id
  content: String, // 评论内容
  isDelete: Boolean, // 是否删除
  user: Object.id, // 用户id
  replyId: Object.id,
  replyUserId: Object.id,
};
// 短信验证码
const authCodeSchema = {
  expireTime: Date, // 过期时间
  email: String,
  captcha: String, // 验证码
  type: String,
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
const organizeSchema = {
  name: String,
  // flag: String, //组织号
  is_Delete: Boolean,
  motto: String,
  userId: ObjectId, //组织的发起人
  papers: [{ paper: ObjectId, publish: Boolean }], // 组织试卷
  part: [{ user: ObjectId, nickname: String, pass: Boolean }], // 参与用户 用户昵称
};

// 成绩  两个主键   组织和试卷id
const gradeSchema = {
  organize: ObjectId,
  paper: ObjectId,
  userSocre: [
    {
      userId: objectId,
      score: [{ question: ObjectId, point: Number }],
    },
  ],
};

// 试卷信息
const paperSchema = {
  name: String,
  detail: String,
  questions: String,
  ownership: ObjectId, // 创建者
  questions: [
    {
      question: Object,
      grade: Number, //分数
    },
  ], // 题目
  _createTime: Date,
  _updateTime: Date,
  completeNum: Object.id, //人数
  points: Number, //总分
};

// 分类信息
const tagsSchema = {
  name: String,
  tags: [String], // 标签
};

//错题本
const wrongTopic = {};

// 浏览记录
const historySchame = {
  userId: ObjectId,
  quetionsId: ObjectId,
  // 如果没有登录就获取ip 来判断是否刷点击量
  ip: Object,
};
