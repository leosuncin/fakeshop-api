import { faker } from '@faker-js/faker';
import type { Request } from 'express';
import { createMocks } from 'node-mocks-http';

import Product from '@/models/Product';
import getByCategoryHandler from '@/routes/products/getByCategory';
import * as db from '@/utils/db';
import { buildProduct } from '@/utils/test-helpers';

describe('Get by category handler', () => {
  const products = Array.from({ length: 3 }, () => buildProduct());

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    await Product.create(products);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should get all products by category', async () => {
    const { category } = faker.helpers.arrayElement(products);
    const { req, res } = createMocks<Request<{ category: string }>>({
      method: 'GET',
      url: `/products/categories/${category}`,
    });

    await getByCategoryHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);
    expect(res._getHeaders()).toHaveProperty(
      'x-total-count',
      expect.any(Number),
    );

    expect(Array.isArray(res._getJSONData())).toBe(true);
  });

  it('should get an empty list of products when category not exists', async () => {
    const { req, res } = createMocks<Request<{ category: string }>>({
      method: 'GET',
      url: `/products/categories/${faker.lorem.word()}`,
    });

    await getByCategoryHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);
    expect(res._getHeaders()).toHaveProperty('x-total-count', 0);

    expect(Array.isArray(res._getJSONData())).toBe(true);
    expect(res._getJSONData()).toHaveLength(0);
  });
});
