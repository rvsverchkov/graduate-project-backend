const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const app = express();
const { PORT = 3000 } = process.env;
const path = require('path');
const usersRoutes = require('./routes/users.js');
const testsRoutes = require('./routes/tests.js');
const answersRoutes = require('./routes/answers.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const NotFoundError = require('./errors/not-found-error.js');
const { application } = require('express');

const corsOptions = {
  credentials: true,
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'https://rvsverchkov-project.ru'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/graduate-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);
app.use('/', usersRoutes);
app.use('/', testsRoutes);
app.use('/', answersRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла непредвиденная ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
