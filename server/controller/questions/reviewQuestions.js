const validator = require('../../middleware/validator');
const addMessage = require('../message/addmessage');
const { body } = require('express-validator');
const { checkQutionsId } = require('./service/quetionsServe');

/**
 *  普通用户只能设置 1 发起审核
 *  管理员可以设置2 3  通过审核
 *
 */
const reviewQuestionsValidator = [
  validator([validator.isValidObjectId(['params'], 'qutionsId')]),
  validator([
    body('reviewMessage').optional().isString().withMessage('审核消息为字符串类型'),
    body('reviewStatus')
      .exists()
      .withMessage('请输入审核状态！！')
      .bail()
      .isIn(['1', '2', '3'])
      .withMessage('审核状态只能是 1 请求 2 通过 3 驳回')
      .bail()
      .custom(async (reviewStatus, { req }) => {
        console.log('req.user: ', req.user);
        if (req.user.auth === 'user' && reviewStatus === '1')
          return Promise.reject('普通用户只能发起请求');
        if (req.user.auth === 'admin' && !['2', '3'].includes(reviewStatus))
          return Promise.reject('管理员只能审核题目');
      })
      .toInt(),
  ]),
  async (req, res, next) => {
    try {
      const question = await checkQutionsId(req.params.qutionsId);
      req.question = question;
      next();
    } catch (err) {
      console.log('err: ', err);
      next({ code: 400, message: err, data: null });
    }
  },
];

const reviewQuestions = async (req, res, next) => {
  console.log('req.body: ', req.body);
  const { reviewMessage, reviewStatus } = req.body;

  try {
    await req.question.update({ reviewMessage, reviewStatus });

    // 消息通知
    if (reviewStatus === 2) {
      await addMessage({
        toUserId: req.question.userId,
        title: '题目审核通过!!',
        content: `您上传的题目【${req.question.title}】已通过审核`,
        sendEmail: true,
      });
    } else if (reviewStatus === 3) {
      await addMessage({
        toUserId: req.question.userId,
        title: '题目审核失败!!',
        content: `您上传的题目【${req.question.title}】未通过审核，拒绝原因：${
          reviewMessage || '无'
        }`,
        sendEmail: true,
      });
    }

    res.status(200).send({
      code: 202,
      message: '审核成功!!!',
      data: null,
    });
  } catch (error) {
    next({ code: 500, message: '失败', data: null });
  }
};

module.exports = [reviewQuestionsValidator, reviewQuestions];
