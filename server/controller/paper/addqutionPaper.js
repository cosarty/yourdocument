const PaperModel = require('../../model/paperSchema');
const { checkQutionsId } = require('../questions/service/quetionsServe');
const validator = require('../../middleware/validator');
const { body } = require('express-validator');
const mongoose = require('mongoose');
/**
 *试卷添加题目
 */
const addqutionPaperValidator = [
  validator([
    body('questions')
      .isArray()
      .withMessage('题目必须是一个数组!!!')
      .bail()
      .notEmpty()
      .withMessage('qustion不能含有空字符串或为空!!!')
      .bail()
      .custom(async (questions, { req }) => {
        if (
          !questions.every(async (q) => {
            const flag = await mongoose.isValidObjectId(q.question);

            const k = Object.keys(q);

            return (
              k.length === 2 &&
              ['question', 'grade'].every((s) => k.includes(s)) &&
              !isNaN(Number(q.grade)) &&
              q.grade < 100 &&
              flag
            );
          })
        ) {
          return Promise.reject(
            '数据类型错误：{ question: String, grade: Number},单题分数最高为100',
          );
        }
        const noexist = [];
        for (let que of questions) {
          try {
            await checkQutionsId(que.question);
          } catch {
            noexist.push(que.question);
          }
        }

        if (noexist.length > 0) {
          return Promise.reject(`以下题目不存在 ${noexist.join(',')}`);
        }
      }),
    body('points')
      .isNumeric()
      .withMessage('分数必须是整数!!!')
      .custom(async (points) => {
        if (points > 200) return Promise.reject('分数最大支持200分');
      }),
  ]),
];

const addqutionPaper = async (req, res, next) => {
  const { name, detail, points, questions } = req.body;
  const { _id: ownership } = req.user;
  try {
    const newpaper = new PaperModel({ name, detail, points, questions, ownership });
    await newpaper.save();

    res.status(200).send({ code: 200, message: '创建成功!!', data: newpaper });
  } catch {
    next({ code: 500, message: '创建失败!!', data: null });
  }
};

module.exports = [addqutionPaperValidator, addqutionPaper];