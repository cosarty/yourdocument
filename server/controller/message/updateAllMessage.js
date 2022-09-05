const MessageModel = require('../../model/messageSchame');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

// 校验参数
const updateAllMessageValidator = [
  validator([
    body('status')
      .optional()
      .isIn(['0', '1'])
      .withMessage('消息状态只能是 0 未读 1 已读')
      .bail()
      .toInt(),
  ]),
];

// 添加评论
const updateAllMessage = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { status } = req.body;

    await MessageModel.find({ toUserId: _id, status: 0 }).updateMany({ status });

    res.status(200).send({
      code: 200,
      message: '读取成功!!',
      data: null,
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '操作失败', data: null });
  }
};

module.exports = [updateAllMessageValidator, updateAllMessage];
