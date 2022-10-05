const multer = require('multer');
const path = require('path');
const mime = require('mime');
const fs = require('fs');

const saveDir = {
  avatar: 'avatarDir',
};

/**
 * fields : 接收的字段名
 * ply{
 * acceptType:[] 运行的类型文件
 * fileSize：大小
 * files:文件最大数量
 * }
 * @param {*} ply
 * @returns
 */
const uploadMiddleware =
  (field, { acceptType = [], fileSize = 1024 * 1024 * 2, files = 1 }) =>
  (req, res, next) => {
    try {
      const assetsDir = require('config')['assetsDir'];
      const dirs = path.join(assetsDir.base, assetsDir[saveDir[field]]);
      const storage = multer.diskStorage({
        /**
         *  先不做
         * 上传图片的时候先保存到temp 然后  前端发送保存的时候才存入  公开文件夹  否则删除
         */
        destination: function (req, file, cb) {
          const accessPath = path.join(process.cwd(), dirs);
          if (!fs.existsSync(accessPath)) {
            // 递归创建目录
            fs.mkdirSync(accessPath, { recursive: true });
          }

          cb(null, accessPath);
        },
        filename: function (req, file, cb) {
          const ext = mime.getExtension(file.mimetype);
          let filename = file.originalname.split('.')[0] + '-' + Date.now() + '.' + ext;
          cb(null, filename);
        },
      });
      const upload = multer({
        storage,
        limits: {
          fileSize,
          files,
        },
        fileFilter(req, file, cb) {
          if (!acceptType.includes(mime.getExtension(file.mimetype))) {
            // 如果有问题，你可以总是这样发送一个错误:
            cb(new Error('文件类型必须是：' + acceptType.map((f) => '.' + f).join(' ')));
          }
          cb(null, true);
        },
      }).single(field);

      upload(req, res, function (err) {
        let message = null;
        if (err instanceof multer.MulterError) {
          message = '文件超过2M';
        } else if (err) {
          message = err.message;
        }
        if (err) return next({ code: 400, message, data: null });

        req.fileUrl = dirs;
        next();
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

module.exports = uploadMiddleware;
