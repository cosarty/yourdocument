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
      });
    // .project({
    //   _id: 0,
    //   user: { nickname: 1, _id: 1 },
    //   organizes: { name: 1, _id: 1, motto: 1, isPublish: 1, part: 1, flag: 1 },
    // });
    res.status(200).send({ code: 200, message: '获取成功!!', data: selfList[0] });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [selfOrganize];
