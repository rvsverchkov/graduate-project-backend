const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth.js');
const {
  createArticle, getArticles, deleteArticle,
} = require('../controllers/articles.js');

function validationUrl(value) {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Был введен не URL адрес');
  }
  return value;
}

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(validationUrl),
    image: Joi.string().custom(validationUrl),
  }),
}), auth, createArticle);
router.get('/articles', auth, getArticles);
router.delete('/articles/:id', auth, deleteArticle);

module.exports = router;
