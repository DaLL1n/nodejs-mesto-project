import { Router } from 'express';
import { cardControllers } from '../controllers';
import { validation } from '../middlewares';

const router = Router();
const {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = cardControllers;

const {
  validateCardId,
  validateCreateCard,
  validateLikeCard,
  validateDislikeCard,
} = validation;

router.get('/cards', getAllCards);

router.post('/cards', validateCreateCard, createCard);

router.put('/cards/:cardId/likes', validateLikeCard, likeCard);

router.delete('/cards/:cardId', validateCardId, deleteCard);
router.delete('/cards/:cardId/likes', validateDislikeCard, dislikeCard);

export default router;
