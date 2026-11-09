import type { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/errors';
import Card, { type ICard } from '../models/card';

export function createCard(req: Request, res: Response, next: NextFunction) {
  const { name, link }: ICard = req.body;

  return Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

export function getAllCards(_req: Request, res: Response, next: NextFunction) {
  return Card.find()
    .then((card) => res.send(card))
    .catch((err) => {
      const error = ApiError.from(err);
      return next(error);
    });
}

export function deleteCard(req: Request, res: Response, next: NextFunction) {
  return Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ApiError(
          'Карточка с указанным _id не найдена',
          'NotFound',
        );
      }

      if (card.owner.toString() !== req.user._id) {
        throw new ApiError('Карточка принадлежит другому пользователю', 'Forbidden');
      }

      return card.deleteOne().then(() => res.send(card));
    })
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

export function likeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ApiError(
          'Передан несуществующий _id карточки',
          'NotFound',
        );
      }

      return res.send(card);
    })
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

export function dislikeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ApiError(
          'Передан несуществующий _id карточки',
          'NotFound',
        );
      }

      return res.send(card);
    })
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}
