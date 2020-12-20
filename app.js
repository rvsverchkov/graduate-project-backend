const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const app = express();
const PORT = 3000;
const path = require('path');
const usersRoutes = require('./routes/users.js');
const articlesRoutes = require('./routes/articles.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const NotFoundError = require('./errors/not-found-error.js');

mongoose.connect('mongodb://localhost:27017/diplomadb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);
app.use('/', usersRoutes);
app.use('/', articlesRoutes);
app.use('*', (req, res, next) => {
    next(new NotFoundError('Запрашиваемый ресурс не найден'));
})
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
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});