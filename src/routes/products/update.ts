import type { Request, Response } from 'express';
import type { RequireAtLeastOne } from 'type-fest';

import type { ProductBase, ProductJson } from '@/models/Product';
import Product from '@/models/Product';
import type { ProductNotFound } from '@/utils/types';

async function updateProduct(
  request: Request<{ id: string }, never, RequireAtLeastOne<ProductBase>>,
  response: Response<ProductJson | ProductNotFound>,
) {
  const { id } = request.params;
  const product = await Product.findById(id);

  if (!product) {
    response.status(404).json({
      message: `Product with id: ${id} not found`,
    });
    return;
  }

  await product.updateWith(request.body);

  response.json(product);
}

export default updateProduct;
