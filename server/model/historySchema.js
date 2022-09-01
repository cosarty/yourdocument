const createShcema = require('./util/createShcema');
const { model, Schema } = require('mongoose');
const historySchema = createShcema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: Schema.Types.ObjectId, ref: 'Questions', required: true },
  ip: String,
});

module.exports = model('History', historySchema);
