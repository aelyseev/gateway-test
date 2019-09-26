const jwt = require('jsonwebtoken');
const { authentication } = require('./config');

module.exports = function createAccessToken(data, expiresIn = authentication.accessTokenExpiration) {
  return jwt.sign(data, authentication.secret, { expiresIn });
};
