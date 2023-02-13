import { Schema, model, Document } from 'mongoose';

export const productCategory = [
  'cpu',
  'mobo',
  'gpu',
  'ram',
  'ssd',
  'hdd',
  'psu',
  'case',
  'cooler',
  'monitor',
  'other',
] as const;
export type ProductCategory = (typeof productCategory)[number];

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string | null;
  category?: ProductCategory;
  brand?: string | null;
  photo?: string | 'nopic.png';
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
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: 'other',
      lowercase: true,
    },
    brand: {
      type: String,
      trim: true,
      default: null,
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
