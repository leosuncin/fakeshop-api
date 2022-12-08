import { faker } from '@faker-js/faker';
import { createMocks } from 'node-mocks-http';

import Product from '@/models/Product';
import findProductsHandler from '@/routes/products/find';
import * as db from '@/utils/db';
import { buildProduct } from '@/utils/test-helpers';

describe('Find products handler', () => {
  const products = [buildProduct(), buildProduct(), buildProduct()];

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    await Product.insertMany(products);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should get all products', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/products',
    });

    await findProductsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);
    expect(res._getHeaders()).toHaveProperty(
      'x-total-count',
      expect.any(Number),
    );

    expect(Array.isArray(res._getJSONData())).toBe(true);
    expect(res._getJSONData().length).toBeGreaterThanOrEqual(3);
  });

  it('should get all products by category', async () => {
    const { category } = faker.helpers.arrayElement(products);
    const { req, res } = createMocks({
      method: 'GET',
      url: `/products?category=${encodeURIComponent(category)}`,
      query: { category },
    });

    await findProductsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(Array.isArray(res._getJSONData())).toBe(true);
    expect(res._getJSONData().length).toBeGreaterThanOrEqual(1);
  });

  it.each(['asc', 'desc'])('should sort products by %s', async (sort) => {
    const { req, res } = createMocks({
      method: 'GET',
      url: `/products?sort=${sort}`,
      query: { sort },
    });

    await findProductsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(Array.isArray(res._getJSONData())).toBe(true);
    expect(res._getJSONData().length).toBeGreaterThanOrEqual(1);
  });
});
