import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

interface UserDocument extends Document {
  password: string;
}

const schema = new Schema<UserDocument>(
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

const User = mongoose.model('User', schema);

export default User;
