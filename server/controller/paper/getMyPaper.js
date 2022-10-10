const PaperModel = require('../../model/paperSchema');
const mongoose = require('mongoose');

const getMyPaper = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const paper = await PaperModel.aggregate()
      .match({
        isDelete: false,
        ownership: mongoose.Types.ObjectId(_id),
        'questions.isDelete': false,
        // @see  http://www.qb5200.com/article/224626.html
        // 数组下标0必须存在
        'questions.0': { $exists: 1 },
      })
      .lookup({
        from: 'organizes',
        foreignField: 'papers.papersId',
        localField: '_id',
        as: 'organize',
      })
      .project({
        _id: 1,
        name: 1,
        detail: 1,
        create_time: 1,
        questions: 1,
        organize: {
          _id: 1,
          name: 1,
        },
      });
    res.status(200).send({
      code: 200,
      message: '获取成功!!',
      data: paper,
    });
  } catch (err) {
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [getMyPaper];
