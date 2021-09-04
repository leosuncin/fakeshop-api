import mongoose from 'mongoose';
import type { Except, RequireAtLeastOne } from 'type-fest';

import type { Paginate } from '@/utils/types';

export interface ProductBase {
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface ProductDocument
  extends mongoose.Document<mongoose.Types.ObjectId>,
    ProductBase {
  createdAt: Date;
  updatedAt: Date;
  updateWith(updates: RequireAtLeastOne<ProductBase>): Promise<ProductDocument>;
}

export interface ProductModel extends mongoose.Model<ProductDocument> {
  createProduct(newProduct: ProductBase): Promise<ProductDocument>;
  paginate(
    query: mongoose.FilterQuery<ProductDocument>,
    pagination?: Partial<Paginate & { skip: number }>,
  ): Promise<[ProductDocument[], number]>;
}

export type ProductJson = Except<
  mongoose.LeanDocument<ProductDocument>,
  '__v' | '_id' | 'updateWith'
>;

const properties: Set<keyof ProductBase> = new Set([
  'title',
  'price',
  'category',
  'description',
  'image',
]);

function isKeyOfProduct(key: string): key is keyof ProductBase {
  // @ts-expect-error key has to be a property of product
  return properties.has(key);
}

export const ProductSchema = new mongoose.Schema<
  ProductDocument,
  ProductModel,
  ProductBase
>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      index: true,
      required: true,
      minlength: 3,
    },
    description: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

ProductSchema.methods.toJSON = function () {
  return {
    id: this._id,
    title: this.title,
    price: this.price,
    category: this.category,
    description: this.description,
    image: this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

ProductSchema.methods.updateWith = function (
  updates: RequireAtLeastOne<ProductBase>,
): Promise<ProductDocument> {
  for (const [key, value] of Object.entries(updates)) {
    if (isKeyOfProduct(key) && value) {
      Object.assign(this, { [key]: value });
    }
  }
  return this.save();
};

ProductSchema.statics.createProduct = async function (newProduct: ProductBase) {
  const product = new Product(newProduct);

  await product.save();

  return product;
};

ProductSchema.statics.paginate = async function (
  query: mongoose.FilterQuery<ProductDocument>,
  pagination?: Paginate & { skip: number },
): Promise<[ProductDocument[], number]> {
  const { limit, skip, sort } = pagination!;
  return Promise.all([
    Product.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ _id: sort === 'desc' ? -1 : 1 }),
    Product.countDocuments(query),
  ]);
};

const Product = mongoose.model('Product', ProductSchema as any) as ProductModel;

export default Product;
