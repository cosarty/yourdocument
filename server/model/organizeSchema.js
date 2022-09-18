const { model, Schema } = require('mongoose');
const createShcema = require('./util/createShcema');

const organizeSchema = createShcema({
  name: { type: String, required: true },
  flag: { type: String, required: true }, //邀请码
  isDelete: { type: Boolean, default: false },
  isPublish: { type: Boolean, required: true }, // 是否公开
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //组织的发起人
  papers: [
    {
      papersId: { type: Schema.Types.ObjectId, ref: 'Paper' },
      publish: { type: Boolean, default: false },
    },
  ], // 组织试卷
  part: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      nickname: { type: String },
      pass: { type: Boolean, default: false }, // 是否通过组织
    },
  ], // 参与用户 用户昵称
  motto: { type: String }, // 简介
});

module.exports = model('Organize', organizeSchema);
