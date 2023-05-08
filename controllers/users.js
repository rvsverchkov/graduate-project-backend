const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RequestError = require('../errors/request-error.js');
const AuthentificationError = require('../errors/authentification-error.js');
const ConflictError = require('../errors/conflict-error.js');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
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

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new RequestError('Были введены невалидные данные');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch(() => next(new ConflictError('Пользователь с таким адресом электронной почты уже существует')));
};

const updateProfile = (req, res, next) => {
  const {
    name, about,
  } = req.body;
  if (!name || !about) {
    throw new RequestError('Были введены невалидные данные');
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  if (!avatar) {
    throw new RequestError('Были введены невалидные данные');
  }
  User.findOneAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserInfo, createUser, updateProfile, updateAvatar, login,
};
