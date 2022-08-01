const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
  singleQuote: true, // 单引号替代双引号
  jsxSingleQuote: true, // jsx单引号
};
