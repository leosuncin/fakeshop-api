import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductJson } from '@/models/Product';
import type { ProductNotFound } from '@/utils/types';

async function getOneProduct(
  request: Request<{ id: string }, never>,
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

  response.json(product);
}

export default getOneProduct;
