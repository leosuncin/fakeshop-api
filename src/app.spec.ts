import request from 'supertest';

import app from '@/app';
import * as db from '@/utils/db';
import { buildProduct, productMatcher } from '@/utils/test-helpers';

describe('App', () => {
  const route = '/api/products';

  beforeAll(async () => {
    await db.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should be healthy', async () => {
    await request(app)
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchInlineSnapshot(`
Object {
  "db": "connected",
  "status": "up",
}
`);
      });
  });

  it('should create a product', async () => {
    const response = await request(app)
      .post(route)
      .send(buildProduct())
      .expect(201);

    expect(response.body).toMatchObject(productMatcher);
  });

  it('should fail to create a product with invalid data', async () => {
    const response = await request(app).post(route).send({}).expect(422);

    expect(response.body).toMatchInlineSnapshot(`
Object {
  "errors": Object {
    "category": Array [
      "Path \`category\` is required.",
    ],
    "price": Array [
      "Path \`price\` is required.",
    ],
    "title": Array [
      "Path \`title\` is required.",
    ],
  },
  "message": "Validation errors",
}
`);
  });

  it('should get all products', async () => {
    const response = await request(app).get(route).expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
    expect(response.body).toMatchObject(
      expect.arrayContaining([expect.objectContaining(productMatcher)]),
    );
  });

  it('should fail to get a product with invalid id', async () => {
    await request(app)
      .get('/api/products/not-a-valid-id')
      .expect(404)
      .expect((response) => {
        expect(response.body).toMatchInlineSnapshot(`
Object {
  "message": "API endpoint does not exist",
}
`);
      });
  });

  it('should update a product', async () => {
    const { body: product } = await request(app)
      .post(route)
      .send(buildProduct());
    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .send(buildProduct())
      .expect(200);

    expect(response.body).toMatchObject({
      ...productMatcher,
      id: product.id,
      createdAt: product.createdAt,
    });
  });

  it('should fail to update a product with invalid data', async () => {
    const { body: product } = await request(app)
      .post(route)
      .send(buildProduct());
    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .send(buildProduct({ category: 'az' }))
      .expect(422);

    expect(response.body).toMatchInlineSnapshot(`
Object {
  "errors": Object {
    "category": Array [
      "Path \`category\` (\`az\`) is shorter than the minimum allowed length (3).",
    ],
  },
  "message": "Validation errors",
}
`);
  });

  it('should remove a product', async () => {
    const { body: product } = await request(app)
      .post(route)
      .send(buildProduct());

    await request(app)
      .delete(`/api/products/${product.id}`)
      .expect((response) => {
        expect(response.status).toBe(204);
        expect(response.noContent).toBe(true);
      });
  });

  it('should get all categories of products', async () => {
    const response = await request(app)
      .get('/api/products/categories')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toMatchObject(
      expect.arrayContaining([expect.any(String)]),
    );
  });

  it('should get products by category', async () => {
    const response = await request(app)
      .get('/api/products/categories/Tools')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
