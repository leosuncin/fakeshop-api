import type { Request, Response } from 'express';
import { createMocks } from 'node-mocks-http';

import Product, { ProductDocument, ProductJson } from '@/models/Product';
import updateProductHandler from '@/routes/products/update';
import * as db from '@/utils/db';
import { buildProduct, productMatcher } from '@/utils/test-helpers';
import type { ProductNotFound } from '@/utils/types';

describe('Update one product handler', () => {
  let product: ProductDocument;

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    product = new Product(buildProduct());
    await product.save();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should update only valid fields of product', async () => {
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'PUT',
      url: `/products/${product._id}`,
      body: {
        id: '6129d416e7b1dd1d463bdd76',
      },
      params: {
        id: product._id,
      },
    });

    await updateProductHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject<ProductJson>(productMatcher);
  });

  it('should update one product', async () => {
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'PUT',
      url: `/products/${product._id}`,
      body: {
        price: 69.95,
      },
      params: {
        id: product._id,
      },
    });

    await updateProductHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject<ProductJson>(productMatcher);
  });

  it('should fail to update one product', async () => {
    const fakeId = '6129d18a5b586b010530c339';
    const { req, res } = createMocks<Request<{ id: string }>, Response>({
      method: 'PUT',
      url: `/products/${fakeId}`,
      body: {
        price: 69.95,
      },
      params: { id: fakeId },
    });

    await updateProductHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject<ProductNotFound>({
      message: expect.stringMatching(/product with id: \w+ not found/i),
    });
  });
});
