const MessageModel = require('../../model/messageSchame');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');

const searchOriginMessageValidator = validator([
  body('status')
    .optional()
    .isIn(['0', '1'])
    .withMessage('消息状态只能是 0 未读 1 已读')
    .bail()
    .toInt(),
  body('pageSize').optional().isInt().withMessage('页面大小必须是整型的').toInt(),
  body('pageNum').optional().isInt().withMessage('页数必须是整型的').toInt(),
]);

/**
 * 获取自己上传的题目
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const searchOriginMessage = async (req, res, next) => {
  const queryData = {};

  const { status, pageSize, pageNum } = req.body;
  const skip = pageSize * (pageNum - 1);
  Number.isInteger(status) && (queryData.status = status);

  // 技巧 获取数量
  const queryMessage = () =>
    MessageModel.find()
      .where({ ...queryData, isDelete: false, toUserId: req.user._id })
      .populate({ path: 'toUserId', select: { nickname: 1, avtar_url: 1 } });

  // 搜索
  const messagelist = await queryMessage()
    .skip(skip)
    .limit(pageSize || null);
  const total = await queryMessage().count();
  try {
    res.status(200).send({
      code: 200,
      message: '搜索成功!!!',
      data: { list: messagelist, total },
    });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '搜索失败', data: null });
  }
};

module.exports = [searchOriginMessageValidator, searchOriginMessage];
