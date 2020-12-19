const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const registerUser = (req, res, next) => {
    const {
        email, password, name
    } = req.body;
    bcrypt.hash(password, 10)
        .then((hash) => User.create({
            email, 
            password: hash,
            name
        }))
        .then((user) => res.send(user))
        .catch((error) => res.send(error))
}

module.exports = {
    registerUser
};