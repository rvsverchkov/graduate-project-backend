/* eslint-disable no-underscore-dangle */
const test = require('../models/test');

const getTests = (req, res, next) => {
  test.find({})
    .then((test) => {
      res.status(200).send(test);
    })
    .catch(next);
};

const getOfficeTest = (req, res, next) => {
  console.log('Поиск начался')
  test.find({
    "name": 'office'
  })
    .then((test) => {
      res.status(200).send(test);
    })
    .catch(next);
};

const createTest = (req, res, next) => {
  const { name, questions } = req.body;
  test.create({ name, questions })
    .then((test) => {
      res.status(200).send(test);
    })
    .catch(next);
};

module.exports = {
  getTests,
  getOfficeTest,
  createTest
};
