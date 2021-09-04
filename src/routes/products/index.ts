import { RequestHandler, Router } from 'express';
import asyncHandler from 'express-async-handler';

import handleValidationError from '@/middleware/validationError';
import createProduct from '@/routes/products/create';
import findProducts from '@/routes/products/find';
import getByCategory from '@/routes/products/getByCategory';
import getCategories from '@/routes/products/getCategories';
import getOneProduct from '@/routes/products/getOne';
import removeProduct from '@/routes/products/remove';
import updateProduct from '@/routes/products/update';

const router = Router();

router
  .route('/products')
  .post(asyncHandler(createProduct))
  .get(asyncHandler(findProducts));
router
  .route('/products/:id([0-9a-f]{24}$)')
  .put(asyncHandler(updateProduct as unknown as RequestHandler))
  .delete(asyncHandler(removeProduct as unknown as RequestHandler))
  .get(asyncHandler(getOneProduct as unknown as RequestHandler));
router.route('/products/categories').get(asyncHandler(getCategories));
router
  .route('/products/categories/:category')
  .get(asyncHandler(getByCategory as unknown as RequestHandler));
router.use(handleValidationError);

export default router;
