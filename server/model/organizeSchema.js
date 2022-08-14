const { model, Schema } = require('mongoose');
const createShcema = require('./util/createShcema');

const organizeSchema = createShcema({
  name: { type: String, require: true },
  is_Delete: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true }, //组织的发起人
  papers: [{ type: Schema.Types.ObjectId, ref: 'Paper' }], // 组织试卷
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
