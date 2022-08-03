const Article = require('../model/article');
const User = require('../model/user');

// 获取文章
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId);

    res.json(article);
  } catch (err) {
    // 设置错误状态码
    res.status(400);
    next({ msg: '查询失败' });
  }
};

// 创建文章
exports.createArticle = async (req, res, next) => {
  try {
    const article = new Article({ ...req.body, author: req.userId });

    //把数据 映射到结果
    // 映射作者
    await article.populate('author');
    // 保存还是保存用户id
    await article.save();

    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
};

// 获取文章列表
exports.getArticles = async (req, res, next) => {
  try {
    const { limit = 10, pageNo = 1, tag, author } = req.query;
    const filter = {};

    // 设置筛选条件
    tag && (filter.tagList = tag);

    // 查询作者
    if (author) {
      const user = await User.findOne({
        $or: [{ username: author }, { email: author }],
      });
      filter.author = user ? user._id : null;
    }

    const articles = await Article.find(filter)
      .skip((pageNo - 1) * limit * 1) // 跳过多少条
      .limit(limit * 1) // 取多少条
      .sort({ createdAt: -1 }); // -1 降序 1升序

    const articlesCount = await Article.countDocuments(); // 获取文档总数量

    res.status(200).json({
      articles,
      articlesCount,
    });
  } catch (err) {
    next(err);
  }
};

// 更新文章
exports.updateArticle = async (req, res, next) => {
  try {
    const { title, body, description, tagList } = req.body;
    const article = req.article;
    // 判断数据是否存在
    title && (article.title = title);
    body && (article.body = body);
    description && (article.description = description);
    tagList && (article.tagList = tagList);

    // 直接保存
    await article.save();

    res.status(201).json({
      article,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeArticle = async (req, res, next) => {
  try {
    const article = req.article;

    // 直接保存
    await article.remove();

    // 状态码204没有返回数据
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
