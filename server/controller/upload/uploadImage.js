const { getUserInfo } = require('../user/server/userServe');
const upload = require('../../middleware/upload');
const path = require('path');

const uploadImage = async (req, res, next) => {
  if (!req.file) return next({ code: 400, message: '请选择头像!!', data: null });

  const { _id } = req.user;

  try {
    const user = await getUserInfo(_id);
    // console.log('user: ', user);
    user.avtar_url = require('config')['assetsDir']['avatarDir'] + '/' + req.file.filename;

    await user.save();
    res.status(202).send({ code: 202, message: '上传成功!!', data: user });
  } catch {
    next({ code: 500, message: '上传失败!!', data: null });
  }
};

module.exports = [upload('avatar', { acceptType: ['png', 'jpg', 'gif', 'jpeg'] }), uploadImage];
