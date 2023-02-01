import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: string;
  description?: string;
  category?: string;
  brand?: string;
  photo?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'n/a',
    },
    category: {
      type: String,
      trim: true,
      default: 'other',
    },
    brand: {
      type: String,
      trim: true,
      default: 'n/a',
    },
    photo: {
      type: String,
      default: 'nopic.png',
    },
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
