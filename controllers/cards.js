/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const RequestError = require('../errors/request-error.js');
const NotFoundError = require('../errors/not-found-error.js');
const PermissionError = require('../errors/permission-error.js');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  if (!name || !link) {
    throw new RequestError('Были введены невалидные данные');
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.remove()
          .then((currentCard) => {
            res.status(200).send(currentCard);
          });
      } else {
        throw new PermissionError('Данная карточка не является вашей');
      }
    })
    .catch(next);
};

const likeCard = async (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Лайк не может быть поставлен, поскольку выбранная карточка отсутствует на сервере');
      } else {
        res.status(200).send({ card, message: 'Лайк был успешно поставлен на выбранную карточку' });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Лайк не может быть удален, поскольку выбранная карточка отсутствует на сервере');
      } else {
        res.status(200).send({ card, message: 'Лайк был успешно удален с выбранной карточки' });
      }
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
