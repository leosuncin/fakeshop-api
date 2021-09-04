import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductNotFound } from '@/utils/types';

async function removeProduct(
  request: Request<{ id: string }>,
  response: Response<ProductNotFound>,
) {
  const { id } = request.params;
  const product = await Product.findById(id);

  if (!product) {
    response.status(404).json({
      message: `Product with id: ${id} not found`,
    });
    return;
  }

  await product.remove();

  response.status(204).end();
}

export default removeProduct;
