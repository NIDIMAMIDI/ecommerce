import { SubCategory } from '../../model/category/subCategoryModel.js';
import { Product } from '../../model/product/productModel.js';
// import { createProducts } from '../../helpers/product/productHelpers.js';

// ====================================  Creating Product  ====================================

export const createProduct = async (req, res, next) => {
  try {
    // get the subCategoryId from request parametes and store it in subCategoryId
    const { subCategoryId } = req.params;

    // get the product details from request body
    const { name, image, quantity, price, status, description } = req.body;

    // Checking weather given subCategoryId is present in the SubCategory Collection
    const subCategory = await SubCategory.findById(subCategoryId);

    // If SubCategory is not present then throw Error Response
    if (!subCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Sub-category does not found'
      });
    }

    // Create the Product with Provided product details
    const product = await Product.create({
      subCategoryId,
      name,
      image,
      quantity,
      price,
      status,
      description
    });

    // Success Response
    res.status(201).json({
      status: 'success',
      productsData: {
        product
      }
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// ====================================  Get Products By SubCategoryId  ====================================

export const getProductsBySubCategoryId = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    // Check if sub-category exists
    const subCategory = await SubCategory.findById(subCategoryId);

    // If subCategory is not there then send Error Response
    if (!subCategory) {
      return res.status(404).json({
        status: 'failure',
        message: 'Sub-category not found'
      });
    }

    // Fetch all products in the sub-category
    const products = await Product.find({ subCategoryId }); // subCategoryId

    // Return success response
    res.status(200).json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// ====================================  Get All Products   ====================================

export const getProducts = async (req, res, next) => {
  try {
    // Fetch all the products in the collection
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      productsData: {
        products
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// ====================================  Update Product Details   ====================================

export const updateProductData = async (req, res, next) => {
  try {
    // fetch the product Id from the request parameters
    const { productId } = req.params;

    // get the product by its id
    const product = await Product.findById(productId);

    // if product details not present then throw Error Response
    if (!product) {
      return res.status(404).json({
        status: 'failure',
        message: 'Product is not found'
      });
    }

    // Update Product details by the provided details in the request body
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true // runValidators
    });

    // Success Response
    res.status(200).json({
      status: 'success',
      produtsData: {
        updatedProduct
      }
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// ====================================  Delete Product by its Id   ====================================

export const deleteProduct = async (req, res, next) => {
  try {
    // fetch the product Id from the request parameters
    const { productId } = req.params;

    // get the product by its id
    const product = await Product.findById(productId);

    // if product details not present then throw Error Response
    if (!product) {
      return res.status(404).json({
        status: 'failure',
        message: 'Product is not found'
      });
    }

    // Update Product details by the provided details in the request body
    await Product.findByIdAndDelete(productId);

    // Success Response
    res.status(204).json({
      status: 'success',
      data: 'Product deleted successfully'
    });
  } catch (err) {
    // Error Response
    res.send(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
