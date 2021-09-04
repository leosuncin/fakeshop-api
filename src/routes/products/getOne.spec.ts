import type { Request, Response } from 'express';
import { createMocks } from 'node-mocks-http';

import Product, { ProductDocument } from '@/models/Product';
import getOneProductHandler from '@/routes/products/getOne';
import * as db from '@/utils/db';
import { buildProduct } from '@/utils/test-helpers';
import type { ProductNotFound } from '@/utils/types';

describe('Get one product handler', () => {
  let product: ProductDocument;

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    product = new Product(buildProduct());
    await product.save();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should get one product', async () => {
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'GET',
      url: `/products/${product._id}`,
      params: { id: product._id },
    });

    await getOneProductHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject({
      id: `${product._id}`,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });
  });

  it('should fail to get one product', async () => {
    const fakeId = '6129c25343078223697b3e27';
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'GET',
      url: `/products/${fakeId}`,
      params: { id: fakeId },
    });

    await getOneProductHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject<ProductNotFound>({
      message: expect.stringMatching(/product with id: \w+ not found/i),
    });
  });
});
