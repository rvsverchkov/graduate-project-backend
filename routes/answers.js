const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const auth = require('../middlewares/auth.js');

const {
    getAnswers,
    getOfficeAnswer,
    getEmailAnswer,
    createAnswer,
} = require('../controllers/answers');

router.get('/answers', auth, getAnswers);
router.get('/answers/office', auth, getOfficeAnswer);
router.get('/answers/email', auth, getEmailAnswer);
router.post('/answers', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        array: Joi.array().required()
    }),
}), createAnswer);

module.exports = router;