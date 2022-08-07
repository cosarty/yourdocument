const express = require('express');

const router = express.Router();

// 用户路由
router.use('/user', require('./user'));
router.use('/tags', require('./tags'));

// 404
// 所有路由定义完之后，最后做404处理 /
router.all('*', (req, res) => {
  res.send('404');
});

module.exports = router;
