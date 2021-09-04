import type { Request, Response } from 'express';

import Product from '@/models/Product';

async function getCategories(_: Request, response: Response<string[]>) {
  const categories = await Product.distinct('category');

  response.json(categories);
}

export default getCategories;
