import mongoose from 'mongoose';
import validator from 'validator';

const { isURL, isEmail } = validator;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value: string) => isURL(value),
      message: 'Некорректная ссылка на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => isEmail(value),
      message: 'Почта указана некорректно',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
