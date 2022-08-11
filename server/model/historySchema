const createShcema = require('./util/createShcema');
const { model } = require('mongoose');
const historySchema = createShcema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  quetionsId: { type: Schema.Types.ObjectId, ref: 'Questions', require: true },
});

module.exports = model('Message', historySchema);
