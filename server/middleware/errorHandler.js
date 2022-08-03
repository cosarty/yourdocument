const util = require('util');

module.exports = (err, req, res, next) => {
  const { code } = err;
  res.status(code).json(err);
};
