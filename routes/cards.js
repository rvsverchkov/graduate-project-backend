const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth.js');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

function validationUrl(value) {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Был введен не URL адрес');
  }
  return value;
}

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().custom(validationUrl),
  }),
}), auth, createCard);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().max(24).hex(),
  }),
}), auth, deleteCard);
router.put('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().max(24).hex(),
  }),
}), auth, likeCard);
router.delete('/cards/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().max(24).hex(),
  }),
}), auth, dislikeCard);

module.exports = router;
