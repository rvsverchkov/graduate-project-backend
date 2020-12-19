const router = require('express').Router();
const {
    registerUser, loginUser
} = require('../controllers/users.js');

router.post('/signup', registerUser);
router.post('/signin', loginUser);

module.exports = router;