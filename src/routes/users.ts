import { Router } from 'express';
import { userControllers } from '../controllers';
import { validation } from '../middlewares';

const router = Router();

const {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = userControllers;

const {
  validateUpdateUser,
  validateUpdateUserAvatar,
  validateUserId,
} = validation;

router.get('/users', getAllUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateUserId, getUserById);

router.patch('/users/me', validateUpdateUser, updateUser);
router.patch('/users/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default router;
