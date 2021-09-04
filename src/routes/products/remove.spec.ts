import type { Request, Response } from 'express';
import { createMocks } from 'node-mocks-http';

import Product, { ProductDocument } from '@/models/Product';
import removeProductHandler from '@/routes/products/remove';
import * as db from '@/utils/db';
import { buildProduct } from '@/utils/test-helpers';
import type { ProductNotFound } from '@/utils/types';

describe('Remove one product handler', () => {
  let product: ProductDocument;

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    product = new Product(buildProduct());
    await product.save();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should remove one product', async () => {
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'DELETE',
      url: `/products/${product._id}`,
      params: { id: product._id },
    });

    await removeProductHandler(req, res);

    expect(res._getStatusCode()).toBe(204);
    expect(res._isJSON()).toBe(false);
  });

  it('should fail to remove one product', async () => {
    const fakeId = '6129d8e8d54714662d1f2523';
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'GET',
      url: `/products/${fakeId}`,
      params: { id: fakeId },
    });

    await removeProductHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject<ProductNotFound>({
      message: expect.stringMatching(/product with id: \w+ not found/i),
    });
  });
});
