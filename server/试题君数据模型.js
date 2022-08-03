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
};
// 注册要填写 邮箱  性别 昵称  密码

const replySchema = {
  uid: ObjectId, //评论用户id
  content: '', // 评论内容
  reviewStatus: '', // 已读状态
  readTime: '', // 阅读时间
  _createTime: String,
  _updateTime: String,
};

// 短信验证码
const authCodeSchema = {
  expireTime: Date, // 过期时间
  email: String,
  captcha: String, // 验证码
};

// 题目信息
// 组织信息
// 试卷信息
// 分类信息
