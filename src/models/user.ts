import mongoose from 'mongoose';
import validator from 'validator';

const { isURL } = validator;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => isURL(value),
      message: 'Некорректная ссылка на аватар',
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
