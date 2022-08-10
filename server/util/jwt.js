const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// 默认30天刷新
//  30 * 24 * 60 * 60 * 1000
exports.createToken = async (data, expiresIn = 10 * 60 * 1000) => {
  const privateKey = fs.readFileSync(path.join(__dirname, '../keys/rsa_private_key.pem'));
  const token = await jwt.sign(data, privateKey, {
    algorithm: 'RS256',
    expiresIn,
  });

  return token;
};

exports.verifyToken = async (token) => {
  const publicKey = fs.readFileSync(path.join(__dirname, '../keys/rsa_public_key.pem'));
  let result;
  try {
    result = await jwt.verify(token, publicKey);
  } catch (error) {
    throw new Error('登录验证失败!');
  }
  return result;
};
