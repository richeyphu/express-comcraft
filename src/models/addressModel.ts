import { Schema, model, Document } from 'mongoose';

export interface IAddress extends Document {
  name: string;
  tel: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    zip: string;
  };
  user: Schema.Types.ObjectId;
}

const schema = new Schema<IAddress>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tel: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      line1: {
        type: String,
        required: true,
        trim: true,
      },
      line2: {
        type: String,
        trim: true,
        default: '',
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      province: {
        type: String,
        required: true,
        trim: true,
      },
      zip: {
        type: String,
        required: true,
        trim: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    collection: 'addresses',
    timestamps: true,
  }
);

const Address = model<IAddress>('Address', schema);

export default Address;
