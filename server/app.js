const express = require('express');
const morgan = require('morgan');
const path = require('path');

const router = require('./router');
const errorHandler = require('./middleware/errorHandler');
const { base, avatarDir } = require('config')['assetsDir'];
// 加载模型
require('./model');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());
// 配置日志
app.use(morgan('dev'));

// 托管静态资源
// 访问前缀
// 托管多个资源
app.use(avatarDir, express.static(path.join(process.cwd(), base, avatarDir)));
// app.use('/config', express.static(path.join(__dirname, './config')));

app.all('*', (req, res, next) => {
  // google需要配置，否则报错cors error
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // 允许的地址 http://127.0.0.1:9000 这样的格式
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 允许跨域请求的方法
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
  // 允许跨域请求 header 携带哪些东西
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since',
  );
  next();
});

app.use('/api', router);

// 错误处理中间件
app.use(errorHandler);

app.listen(PORT);
