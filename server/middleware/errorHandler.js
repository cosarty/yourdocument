const util = require('util');

module.exports = (err, req, res, next) => {
  res.json({ error: err instanceof Error ? util.format(err) : err });
};
