const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const RequestError = require('../errors/request-error.js');
const AuthentificationError = require('../errors/authentification-error.js');
const ConflictError = require('../errors/conflict-error.js');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const registerUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new RequestError('Были введены невалидные данные');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send(user))
    .catch(() => next(new ConflictError('Пользователь с таким адресом электронной почты уже существует')));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new RequestError('Были введены невалидные данные');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new AuthentificationError('Неправильная почта или пароль')));
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  registerUser, loginUser, getUser,
};
