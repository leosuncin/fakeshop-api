import type { Request, Response } from 'express';

import Product from '@/models/Product';
import type { ProductBase, ProductJson } from '@/models/Product';

/**
 * @api {POST} /api/products Create a new product
 * @apiName CreateProduct
 * @apiGroup Product
 *
 * @apiParam (Body) {String}      title       Title of the new product
 * @apiParam (Body) {Number{0-}}  price       Price of the new product
 * @apiParam (Body) {String{3..}} category    Category of the new product
 * @apiParam (Body) {String}      description Description of the new product
 * @apiParam (Body) {String}      image       Image of the new product
 *
 * @apiUse ProductResponse
 *
 * @apiUse ProductValidationError
 */
async function createProduct(
  request: Request<unknown, never, ProductBase>,
  response: Response<ProductJson>,
) {
  const product = await Product.createProduct(request.body);

  response.status(201).json(product);
}

export default createProduct;
