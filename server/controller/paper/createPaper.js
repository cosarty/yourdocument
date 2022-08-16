const PaperModel = require('../../model/paperSchema');
const { name, questions, detail, points } = require('./service/paperValidator');
const validator = require('../../middleware/validator');

/**
 *
 * 创建试卷
 * 试卷名称不能一样
 */
const createPaperValidator = [validator([name, questions, detail, points])];

const createPaper = async (req, res, next) => {
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

module.exports = [createPaperValidator, createPaper];
