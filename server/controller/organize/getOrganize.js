const OrganizeModel = require('../../model/organizeSchema');

// 获取自己加入的的组织列表
const getOrganize = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const getList = await OrganizeModel.aggregate()
      .match({
        'part.pass': false,
        'part.user': userId,
      })
      .project({ _id: 0, organizeId: '$_id', name: 1, motto: 1 });

    res.status(202).send({ code: 202, message: '获取成功!!', data: getList });
  } catch (err) {
    console.log(err);
    next({ code: 500, message: '获取失败!!', data: null });
  }
};

module.exports = [getOrganize];
