import { Router } from 'express';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use(userRouter);
router.use(cardRouter);

export default router;
