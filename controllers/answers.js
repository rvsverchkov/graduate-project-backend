/* eslint-disable no-underscore-dangle */
const answer = require('../models/answer');

const getAnswers = (req, res, next) => {
    answer.find({})
        .then((answer) => {
            res.status(200).send(answer);
        })
        .catch(next);
};

const getOfficeAnswer = (req, res, next) => {
    answer.find({
        "name": 'office'
    })
        .then((answer) => {
            res.status(200).send(answer[0].array);
        })
        .catch(next);
};

const getEmailAnswer = (req, res, next) => {
    answer.find({
        "name": 'email'
    })
        .then((answer) => {
            res.status(200).send(answer[0].array);
        })
        .catch(next);
};

const createAnswer = (req, res, next) => {
    const { name, array } = req.body;
    answer.create({ name, array })
        .then((test) => {
            res.status(200).send(test);
        })
        .catch(next);
};

module.exports = {
    getAnswers,
    getOfficeAnswer,
    getEmailAnswer,
    createAnswer
};
