const { model } = require('mongoose');
const createShcema = require('./util/createShcema');
const tagsSchema = createShcema({
  name: { type: String, required: true },
  tags: [String], // 标签
});

module.exports = model('Tags', tagsSchema);
