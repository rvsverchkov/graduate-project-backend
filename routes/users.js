const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth.js');
const {
  getUsers, createUser, updateUserValueOffice, updateUserValueEmail, updateAvatar, login, getUserInfo,
} = require('../controllers/users');

function validationUrl(value) {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Был введен не URL адрес');
  }
  return value;
}

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserInfo);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.patch('/users/me/office', celebrate({
  body: Joi.object().keys({
    userValue: Joi.number().required()
  }),
}), auth, updateUserValueOffice);
router.patch('/users/me/email', celebrate({
  body: Joi.object().keys({
    userValue: Joi.number().required()
  }),
}), auth, updateUserValueEmail);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validationUrl),
  }),
}), auth, updateAvatar);

module.exports = router;
