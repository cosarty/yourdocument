const mongoose = require('mongoose');
const baseModel = require('./baseModel');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tagList: {
    type: Array,
    default: null,
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
  // 设置映射
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ...baseModel,
});

module.exports = mongoose.model('Article', articleSchema);
