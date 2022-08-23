const { validationResult, buildCheckFunction } = require('express-validator');

const mongoose = require('mongoose');

// 自定义错误格式
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

// 校验规则
const validate = function (validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = myValidationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ code: 400, message: errors.mapped(), data: null });
  };
};

// 自定义封装校验
validate.isValidObjectId = (location, fileds) => {
  return buildCheckFunction(location)(fileds).custom(async (value) => {
    if (!(await mongoose.isValidObjectId(value))) {
      return Promise.reject('id无效!!!');
    }
  });
};

module.exports = validate;
