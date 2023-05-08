const jwt = require('jsonwebtoken');
const AuthentificationError = require('../errors/authentification-error.js');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthentificationError('Для выполнения данного действия необходимо авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    throw new AuthentificationError('Для выполнения данного действия необходимо авторизоваться');
  }

  req.user = payload;

  next();
};
