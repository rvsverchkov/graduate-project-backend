const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const { PORT = 3000, DATABASE_URL } = process.env;
const usersRoutes = require('./routes/users.js');
const articlesRoutes = require('./routes/articles.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const NotFoundError = require('./errors/not-found-error.js');
const { DATABASE_DEV_URL } = require('./config.js');

mongoose.connect(DATABASE_DEV_URL || DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(requestLogger);
app.use('/', usersRoutes);
app.use('/', articlesRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла непредвиденная ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
