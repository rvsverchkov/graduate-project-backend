const Article = require('../models/article.js');
const PermissionError = require('../errors/permission-error.js');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findArticleByCredentials(req.params.id)
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        article.remove()
          .then((currentArticle) => {
            res.status(200).send(currentArticle);
          });
      } else {
        throw new PermissionError('Данная карточка не является вашей');
      }
    })
    .catch(next);
};

module.exports = {
  createArticle, getArticles, deleteArticle,
};
