const MessageModel = require('../../model/messageSchame');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const { checkMessage } = require('./service/messageServe');
// 校验参数
const addCommentValidator = [
  validator([validator.isValidObjectId(['body'], 'messageId')]),
  validator([
    body('status')
      .optional()
      .isIn(['0', '1'])
      .withMessage('消息状态只能是 0 未读 1 已读')
      .bail()
      .toInt(),
  ]),
  validator([body('isDelete').optional().isBoolean().withMessage('删除状态只能是boolean')]),
  async (req, res, next) => {
    try {
      const message = await checkMessage(req.body.messageId);
      if (message.isDelete) return next({ code: 400, message: '消息不存在', data: null });
      if (
        req.user._id.toString() !== message.toUserId.toString() &&
        !['admin', 'super'].includes(req.user.auth)
      )
        return next({ code: 403, message: '你没有此消息权限', data: null });
      req.message = message;
      next();
    } catch (err) {
      console.log('err: ', err);
      next({ code: 400, message: err, data: null });
    }
  },
];

// 添加评论
const updateMessage = async (req, res, next) => {
  try {
    const { isDelete, status } = req.body;
    const result = {};
    isDelete && (result.isDelete = isDelete);
    status && (result.status = status);

    await req.message.update({ ...result, readTime: new Date() });

    res.status(200).send({
      code: 200,
      message: isDelete ? '删除成功!!' : '读取成功!!',
      data: null,
    });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '操作失败', data: null });
  }
};

module.exports = [addCommentValidator, updateMessage];
