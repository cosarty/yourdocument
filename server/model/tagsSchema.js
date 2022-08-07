const mongose = require('mongoose');

const tagsSchema = new mongose.Schema(
  {
    name: String,
    tags: [String], // 标签
    create_time: { type: Date, default: Date.now },
  },
  {
    // 添加时间戳
    /** @see https://blog.csdn.net/IICOOM/article/details/124162592 */
    timestamps: {
      createdAt: false,
      updatedAt: 'update_time',
    },
    versionKey: false,
  },
);

module.exports = mongose.model('Tags', tagsSchema);
