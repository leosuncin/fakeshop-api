import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductJson } from '@/models/Product';
import type { Paginate } from '@/utils/types';

async function findProducts(
  request: Request<
    unknown,
    never,
    unknown,
    Partial<Paginate & { category: string }>
  >,
  response: Response<ProductJson[]>,
) {
  const query = request.query.category
    ? { category: request.query.category }
    : {};
  const [products, productCount] = await Product.paginate(query, {
    limit: request.query.limit,
    skip: request.skip,
    sort: request.query.sort,
  });

  response.setHeader('X-Total-Count', productCount);
  response.json(products);
}

export default findProducts;
