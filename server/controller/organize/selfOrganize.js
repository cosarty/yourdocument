const OrganizeModel = require('../../model/organizeSchema');

// 获取自己创建的的组织列表
const selfOrganize = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const selfList = await OrganizeModel.aggregate()
      .match({ userId, isDelete: false })
      .group({ _id: '$userId', organizes: { $addToSet: '$_id' } })
      .lookup({
        from: 'users',
        foreignField: '_id',
        localField: '_id',
        as: 'user',
      })
      .lookup({
        from: 'organizes',
        foreignField: '_id',
        localField: 'organizes',
        as: 'organizes',
      })
      .project({
        _id: 0,
        user: 1,
        'organizes.name': 1,
        'organizes._id': 1,
        'organizes.motto': 1,
      })
      .unwind('user');

    res.status(202).send({ code: 202, message: '获取成功!!', data: selfList[0] });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [selfOrganize];
