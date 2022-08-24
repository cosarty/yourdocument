const TagsModel = require('../../model/tagsSchema');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const upload = require('../../middleware/upload');
const uploadImageValidator = [validator([body('avatar').exists().withMessage('请选择头像')])];

const uploadImage = async (req, res, next) => {
  const { _d } = req.user;
  const { avatar } = req.body;

  console.log(1);
  try {
    if (!tags || tags.length === 0) {
      await TagsModel.remove({ name });
    } else {
      // 过滤删除的tag
      req.tags.tags = req.tags.tags.filter((i) => !tags.includes(i));
      await req.tags.save();
    }

    res.status(202).send({ code: 202, message: '删除成功!!', data: null });
  } catch {
    next({ code: 500, message: '删除失败!!', data: null });
  }
};

module.exports = [
  uploadImageValidator,
  upload('avatar', { acceptType: ['png', 'jpg', 'gif'] }),
  uploadImage,
];
