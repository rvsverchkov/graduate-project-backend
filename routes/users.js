const router = require('express').Router();
const {
    registerUser
} = require('../controllers/users.js');

router.post('/signup', registerUser);

module.exports = router;