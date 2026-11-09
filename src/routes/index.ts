import { Router } from 'express';
import { userControllers } from '../controllers';
import { auth, validation } from '../middlewares';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.post('/signin', validation.validateLogin, userControllers.login);
router.post('/signup', validation.validateCreateUser, userControllers.createUser);

router.use(auth);
router.use(userRouter);
router.use(cardRouter);

export default router;
