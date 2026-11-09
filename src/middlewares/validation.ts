import { Joi, Segments, celebrate } from 'celebrate';

const objectId = Joi.string().hex().length(24).required();

const userPasswordSchema = Joi.string().required();
const userEmailSchema = Joi.string().email().required();
const userInfoSchema = Joi.string().min(2).max(30);

const cardNameSchema = Joi.string().min(2).max(30)
  .required();

// #region User validate

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: userInfoSchema,
    about: userInfoSchema,
    avatar: Joi.string().uri(),
    email: userEmailSchema,
    password: userPasswordSchema,
  }).messages({ '*': 'Переданы некорректные данные при создании пользователя' }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: userEmailSchema,
    password: userPasswordSchema,
  }).messages({ '*': 'Переданы некорректные данные при авторизации' }),
});

export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: userInfoSchema,
    about: userInfoSchema,
  }).messages({
    '*': 'Переданы некорректные данные при обновлении профиля',
  }),
});

export const validateUpdateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().uri().required(),
  }).messages({
    '*': 'Переданы некорректные данные при обновлении аватара',
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: objectId,
  }).messages({
    '*': 'Передан некорректный _id пользователя',
  }),
});

// #endregion

// #region Card validate

const createCardIdValidation = (message: string) => celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: objectId,
  }).messages({ '*': message }),
});

export const validateCardId = createCardIdValidation(
  'Передан некорректный _id карточки',
);

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: cardNameSchema,
    link: Joi.string().uri().required(),
  }).messages({
    '*': 'Переданы некорректные данные при создании карточки',
  }),
});

export const validateLikeCard = createCardIdValidation(
  'Переданы некорректные данные для постановки лайка',
);

export const validateDislikeCard = createCardIdValidation(
  'Переданы некорректные данные для снятия лайка',
);

// #endregion
