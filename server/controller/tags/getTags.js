const TagsModel = require('../../model/tagsSchema');
// 获取标签
const getTags = async (req, res) => {
  const info = await TagsModel.find().select({ _id: 0, update_time: 0, create_time: 0 });
  res.status(200).send({ code: 200, data: info, message: '获取成功' });
};

module.exports = [getTags];
