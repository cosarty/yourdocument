const util = require('util');

module.exports = (err, req, res, next) => {
  const { code = 500 } = err;
  res.status(code).json(err);
};
