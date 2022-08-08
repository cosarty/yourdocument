const mongose = require('mongoose');

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
      versionKey: false,
      strictPopulate: false,
    },
  );

module.exports = createSchema;
