import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductJson } from '@/models/Product';
import type { Paginate } from '@/utils/types';

async function getByCategory(
  request: Request<{ category: string }, unknown, unknown, Partial<Paginate>>,
  response: Response<ProductJson[]>,
) {
  const { category } = request.params;
  const [products, productCount] = await Product.paginate(
    { category },
    {
      skip: request.skip,
      limit: request.query.limit,
      sort: request.query.sort,
    },
  );

  response.setHeader('X-Total-Count', productCount);
  response.json(products);
}

export default getByCategory;
