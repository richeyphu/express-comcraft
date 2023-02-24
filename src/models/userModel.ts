import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export const userRole = ['member', 'admin'] as const;
export type UserRole = (typeof userRole)[number];

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  wishlist?: Schema.Types.ObjectId[];
  encryptPassword: (password: string) => string;
  checkPassword: (password: string) => boolean;
  _id: Schema.Types.ObjectId;
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
    wishlist: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

schema.methods.encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(8);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

schema.methods.checkPassword = function (password: string): boolean {
  const isValid = bcrypt.compareSync(password, this.password as string);
  return isValid;
};

const User = model<IUser>('User', schema);

export default User;
