import { Router } from 'express';
import { productValidator } from '../../utils/validator/product/productValidator.js';
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsBySubCategoryId,
  updateProductData
} from '../../controllers/product/productControllers.js';

const productRouter = Router();

// Create a Product by its based on Sub Category Id
productRouter.post('/:subCategoryId', productValidator, createProduct);

// Get the products in a subCategory by its subCategoryId
productRouter.get('/:subCategoryId', getProductsBySubCategoryId);

// Get all the products in the collection
productRouter.get('/', getProducts);

// Update the product details by its Id
productRouter.patch('/:productId', updateProductData);

// Delete the product  by its Id
productRouter.delete('/:productId', deleteProduct);

export default productRouter;
