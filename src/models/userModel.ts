import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
}

const schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: 'member',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

schema.methods.encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

schema.methods.checkPassword = function (password: string) {
  const isValid = bcrypt.compareSync(password, this.password);
  return isValid;
};

const User = model<IUser>('User', schema);

export default User;
