import { Category } from '../../model/category/categoryModel.js';
import { SubCategory } from '../../model/category/subCategoryModel.js';

//  Controller function to create a new category

export const createCategory = async (req, res, next) => {
  try {
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({
      name: req.body.name.toLowerCase()
    });

    // If category exists, return a failure response
    if (existingCategory) {
      return res.status(400).json({
        status: 'failure',
        message: 'Category name already exists'
      });
    }

    // Convert the category name to lowercase before creating
    req.body.name = req.body.name.toLowerCase();

    // Create a new category
    const category = await Category.create(req.body);

    // Success Response
    res.status(201).json({
      status: 'success',
      categoriesData: {
        category
      }
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//    Controller function to get all categories

export const getCatergories = async (req, res, next) => {
  try {
    // Retrieve all categories from the database
    const categoriesData = await Category.find({});

    // Success Response
    res.status(200).json({
      status: 'success',
      categories: {
        categoriesData
      }
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//  Controller function to edit an existing category

export const editCategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { categoryId } = req.params;

    // Update the category with the new data
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, {
      new: true, // Return the updated category
      runValidators: true // Run schema validators
    });

    // If the category is not found, return a not found response
    if (!updatedCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Category not found'
      });
    }

    // Success Response
    res.status(200).json({
      status: 'success',
      updatedCategory
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//    Controller function to delete an existing category

export const deleteCategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { categoryId } = req.params;

    // Delete the category from the database
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // If the category is not found, return a not found response
    if (!deletedCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Category not found'
      });
    }

    // Success Response
    res.status(204).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//    Controller function to create a new subcategory

export const createSubCategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { categoryId } = req.params;

    // Get the SubCategorydetails from the request body
    const { name, icon, role } = req.body;

    // Check if the subcategory already exists within the category
    const existingSubCategory = await SubCategory.findOne({
      categoryId: categoryId,
      name: name.toLowerCase()
    });

    // If subcategory exists, return a failure response
    if (existingSubCategory) {
      return res.status(400).json({
        status: 'failure',
        message: 'Subcategory is already available in the category'
      });
    }

    // Create a new subcategory
    const subCategory = await SubCategory.create({
      categoryId,
      name: name.toLowerCase(),
      icon,
      role
    });

    // Success REsponse
    res.status(201).send({
      status: 'success',
      data: {
        subCategory
      }
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//  Controller function to get all subcategories of a specific category

export const getSubCategoriesOfACategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { categoryId } = req.params;

    // Retrieve all subcategories of the specified category
    const subCategories = await SubCategory.find({ categoryId });

    // If no subcategories are found, return a not found response
    if (subCategories.length === 0) {
      return res.status(404).json({
        status: 'failure',
        message: 'No subcategories found for the specified category'
      });
    }

    // Success Response
    res.status(200).json({
      status: 'success',
      subCategoriesData: {
        subCategories
      }
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//    Controller function to edit an existing subcategory

export const editSubCategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { subCategoryId } = req.params;

    // Get the updated details from the request body
    const updateData = req.body;

    // Check if 'name' is in req.body and convert it to lowercase
    if (updateData.name) {
      updateData.name = updateData.name.toLowerCase();
    }

    // Update the subcategory
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      updateData,
      { new: true, runValidators: true }
    );

    // If the subcategory is not found, return a not found response
    if (!updatedSubCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Subcategory not found'
      });
    }

    // Success Response
    res.status(200).json({
      status: 'success',
      data: {
        subCategory: updatedSubCategory
      }
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//    Controller function to delete an existing subcategory
export const deletesubCategory = async (req, res, next) => {
  try {
    // Get the categoryId from the request parameters
    const { subCategoryId } = req.params;

    // Delete the subcategory from the database
    const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);

    // If the subcategory is not found, return a not found response
    if (!deletedSubCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Subcategory not found'
      });
    }

    // Success Response
    res.status(204).json({
      status: 'success',
      message: 'Subcategory deleted successfully'
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
