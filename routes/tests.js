const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const auth = require('../middlewares/auth.js');

const {
  getTests,
  getOfficeTest,
  getEmailTest,
  createTest,
} = require('../controllers/tests');

router.get('/tests', auth, getTests);
router.get('/tests/office', auth, getOfficeTest);
router.get('/tests/email', auth, getEmailTest);
router.post('/tests', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    questions: Joi.array().required()
  }),
}), createTest);

module.exports = router;
