const OrganizeModle = require('../../../model/organizeSchema');

exports.checkOrganizeId = async (id) => {
  const or = await OrganizeModle.findById(id);
  if (!or) return Promise.reject('组织不存在');

  return or;
};
