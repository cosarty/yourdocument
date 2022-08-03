const mongoose = require('mongoose');

// 获取配置
mongoose.connect(require('config').get('dbUrl'), { keepAlive: true });

var db = mongoose.connection;

// 当连接失败的时候
db.on('error', console.error.bind(console, 'connection error:'));

// 连接成功的时候
db.once('open', function () {
  console.log('数据库连接成功！！');
});
