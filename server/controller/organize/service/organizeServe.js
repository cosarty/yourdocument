const OrganizeModle = require('../../../model/organizeSchema');

exports.checkOrganizeId = async (id) => {
  const or = await OrganizeModle.findById(id);
  console.log('or: ', or);
  if (!or) return Promise.reject('组织不存在');
  if (or.isDelete) return Promise.reject('组织不存在');

  return or;
};
