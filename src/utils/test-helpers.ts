import faker from 'faker';

import type { ProductBase, ProductJson } from '@/models/Product';

export function buildProduct(overrides?: Partial<ProductBase>): ProductBase {
  return {
    title: overrides?.title ?? faker.commerce.productName(),
    price: overrides?.price ?? +faker.commerce.price(),
    description: overrides?.description ?? faker.commerce.productDescription(),
    category: overrides?.category ?? faker.commerce.department(),
    image: overrides?.image ?? faker.image.imageUrl(),
  };
}

export const productMatcher: ProductJson = {
  id: expect.any(String),
  title: expect.any(String),
  price: expect.any(Number),
  description: expect.any(String),
  category: expect.any(String),
  image: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};
