const searchQuestions = async (req, res, next) => {
  try {
    res.status(200).send({ code: 200, message: '创建成功!!!', data: '成功' });
  } catch (error) {
    console.log('error: ', error);
    next({ code: 500, message: '保存失败', data: null });
  }
};

module.exports = [searchQuestions];
