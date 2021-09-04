import { createMocks } from 'node-mocks-http';

import Product from '@/models/Product';
import getCategoriesHandler from '@/routes/products/getCategories';
import * as db from '@/utils/db';
import { buildProduct } from '@/utils/test-helpers';

describe('Get categories handler', () => {
  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);

    await Product.create(Array.from({ length: 3 }, () => buildProduct()));
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should get all product's category", async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/products/categories',
    });

    await getCategoriesHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject(
      expect.arrayContaining([expect.any(String)]),
    );
  });
});
