const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth.js');
const {
    registerUser, loginUser, getUser
} = require('../controllers/users.js');

router.post('/signup', celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
        }),
    }), registerUser);
router.post('/signin', celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
        }),
    }), loginUser);
router.get('/users/me', auth, getUser);

module.exports = router;