import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../errors/errors';
import User, { type IUser } from '../models/user';

export function getAllUsers(_req: Request, res: Response, next: NextFunction) {
  return User.find()
    .then((users) => res.send(users))
    .catch((err) => {
      const error = ApiError.from(err);
      return next(error);
    });
}

export function getUserById(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ApiError(
          'Пользователь по указанному _id не найден',
          'NotFound',
        );
      }

      return res.send(user);
    })
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

// #region Регистрация и авторизация пользователя

export function createUser(req: Request, res: Response, next: NextFunction) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  }: IUser = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  }))
    .then((user) => {
      const userData = Object.fromEntries(
        Object.entries(user.toObject())
          .filter(([key]) => key !== 'password'),
      );

      return res.status(201).send(userData);
    })
    .catch((err) => {
      let error = ApiError.from(
        err,
        'Переданы некорректные данные при создании пользователя',
      );

      if (err.code === 11000) {
        error = new ApiError('Пользователь с такой почтой уже есть', 'Conflict');
      }

      return next(error);
    });
}

export function login(req: Request, res: Response, next: NextFunction) {
  const { email, password }: Pick<IUser, 'email' | 'password'> = req.body;

  return User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new ApiError('Пользователь с такой почтой не найден', 'Unauthorized');
    }

    return bcrypt.compare(password, user.password).then((matched) => ({ matched, user }));
  }).then(({ matched, user }) => {
    if (!matched) {
      throw new ApiError('Неправильные пароль или почта', 'Unauthorized');
    }

    const token = jwt.sign(
      { _id: user._id },
      'auth-token',
      { expiresIn: '7d' },
    );

    return res.cookie(
      'auth-token',
      token,
      { httpOnly: true, sameSite: true },
    ).end();
  })
    .catch((err) => {
      const error = ApiError.from(
        err,
        'Переданы некорректные данные при входе',
      );

      return next(error);
    });
}

// #endregion

// #region Операции с авторизованным пользователем

// Универсальная функция для обнволения переданных данных
function updateUserData(req: Request, dataUpdate: Partial<IUser>) {
  return User.findByIdAndUpdate(
    req.user._id,
    dataUpdate,
    {
      new: true,
      runValidators: true,
    },
  ).then((user) => {
    if (!user) {
      throw new ApiError(
        'Пользователь с указанным _id не найден',
        'NotFound',
      );
    }

    return user;
  });
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
  const { name, about }: IUser = req.body;

  return updateUserData(req, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

export function updateUserAvatar(req: Request, res: Response, next: NextFunction) {
  const { avatar }: Pick<IUser, 'avatar'> = req.body;

  return updateUserData(req, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      const error = ApiError.from(err);

      return next(error);
    });
}

export function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ApiError(
          'Пользователь по указанному _id не найден',
          'NotFound',
        );
      }

      return res.send(user);
    })
    .catch((err) => {
      const error = ApiError.from(
        err,
        'Не удалось получить данные текущего пользователя',
      );

      return next(error);
    });
}

// #endregion
