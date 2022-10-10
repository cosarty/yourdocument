const createShcema = require('./util/createShcema');
const { model, Schema } = require('mongoose');
const Score = createShcema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paperId: { type: Schema.Types.ObjectId, ref: 'Paper', required: true },
  gread: [{ question: { type: Schema.Types.ObjectId, ref: 'Questions' }, grade: Number }],
  isSubmit: { type: Boolean, default: false },
});

module.exports = model('Score', Score);
