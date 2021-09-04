import { createMocks } from 'node-mocks-http';

import createProductHandler from '@/routes/products/create';
import * as db from '@/utils/db';
import { buildProduct, productMatcher } from '@/utils/test-helpers';

describe('Create product handler', () => {
  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should create a product', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/products',
      body: buildProduct(),
    });

    await createProductHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._isJSON()).toBe(true);

    expect(res._getJSONData()).toMatchObject(productMatcher);
  });
});
