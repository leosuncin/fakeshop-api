import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductBase, ProductJson } from '@/models/Product';

async function createProduct(
  request: Request<unknown, never, ProductBase>,
  response: Response<ProductJson>,
) {
  const product = await Product.createProduct(request.body);

  response.status(201).json(product);
}

export default createProduct;
