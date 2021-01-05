const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const RequestError = require('../errors/request-error.js');
const ConflictError = require('../errors/conflict-error.js');
const { JWT_DEV_SECRET } = require('../config.js');
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
    .catch((error) => {
      if (error.name === 'MongoError' && error.code === 11000) {
        next(new ConflictError('Пользователь уже зарегистрирован'));
      } else {
        next(error);
      }
    });
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
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((error) => {
      next(error);
    });
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
