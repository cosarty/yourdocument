const mongose = require('mongoose');

// 每张表下面加入两个公共字段
// 更新时间 和 创建时间
const createSchema = (fields) =>
  new mongose.Schema(
    {
      ...fields,
      create_time: { type: Date, default: Date.now },
    },
    {
      // 添加时间戳
      /** @see https://blog.csdn.net/IICOOM/article/details/124162592 */
      timestamps: {
        createdAt: false,
        updatedAt: 'update_time',
      },
      // versionKey: false,
      // strictPopulate: false,
    },
  );

module.exports = createSchema;
