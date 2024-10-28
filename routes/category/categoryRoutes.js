import { Router } from 'express';
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deletesubCategory,
  editCategory,
  editSubCategory,
  getCatergories,
  getSubCategoriesOfACategory
} from '../../controllers/category/categoryControllers.js';
import { categoryValidator } from '../../utils/validator/category/categoriesValidator.js';
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';

// Create a new router instance
const categoryRouter = Router();

// =========================  Category routes  =========================

// Route to get all categories with authorization
categoryRouter.get('/', auth, getCatergories);

// Route to create a category with validation
categoryRouter.post('/', categoryValidator, createCategory);

// Route to edit a category by ID
categoryRouter.patch('/:categoryId', editCategory);

// Route to delete a category by ID
categoryRouter.delete('/:categoryId', deleteCategory);

// =========================  Sub-category routes  =========================

// Route to get subcategories of a specific category with authorization
categoryRouter.get('/:categoryId', auth, getSubCategoriesOfACategory);

// Route to create a subcategory with validation
categoryRouter.post('/:categoryId', categoryValidator, createSubCategory);

// Route to edit a subcategory by ID
categoryRouter.patch('/subcategories/:subCategoryId', editSubCategory);

// Route to delete a subcategory by ID
categoryRouter.delete('/subcategories/:subCategoryId', deletesubCategory);

export default categoryRouter; // Export the router instance as the default export
