import { MultipleProductsOrder } from '../../model/order/multipleProductsOrder.js';
import { Order } from '../../model/order/orderModel.js';
import { TransactionHistory } from '../../model/transaction/transactionHistoryModel.js';

// Fetch order details for a specific user
export const fetchOrderDetails = async (userId) => {
  const orderDetails = await Order.aggregate([
    { $match: { userId: userId } }, // Filter orders by userId
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }, // Deconstruct the product array from lookup
    {
      $lookup: {
        from: 'subcategories',
        localField: 'product.subCategoryId',
        foreignField: '_id',
        as: 'subCategory'
      }
    },
    { $unwind: '$subCategory' }, // Deconstruct the subCategory array from lookup
    {
      $lookup: {
        from: 'categories',
        localField: 'subCategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' }, // Deconstruct the category array from lookup
    {
      $project: {
        _id: 0,
        productName: '$product.name',
        productImage: '$product.image',
        quantity: '$quantity',
        price: '$product.price',
        finalPrice: { $multiply: ['$product.price', '$quantity'] },
        actualPrice: '$product.price',
        categoryName: '$category.name',
        subCategoryName: '$subCategory.name'
      }
    }
  ]);
  return orderDetails; // Return the aggregated order details
};

// Fetch multiple orders details for a specific user with pagination
export const multipleOrderDetails = async (userId, skip, limit) => {
  const orderDetails = await MultipleProductsOrder.aggregate([
    { $match: { userId: userId } }, // Filter orders by userId
    { $unwind: '$orders' }, // Deconstruct the orders array
    {
      $lookup: {
        from: 'products',
        localField: 'orders.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }, // Deconstruct the product array from lookup
    {
      $lookup: {
        from: 'subcategories',
        localField: 'product.subCategoryId',
        foreignField: '_id',
        as: 'subCategory'
      }
    },
    { $unwind: '$subCategory' }, // Deconstruct the subCategory array from lookup
    {
      $lookup: {
        from: 'categories',
        localField: 'subCategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' }, // Deconstruct the category array from lookup
    {
      $group: {
        _id: '$_id',
        userId: { $first: '$userId' },
        orders: {
          $push: {
            product: {
              productId: '$orders.productId',
              quantity: '$orders.quantity',
              price: '$orders.price',
              name: '$product.name',
              productImage: '$product.image',
              totalPrice: { $multiply: ['$orders.quantity', '$product.price'] }
            },
            subCategory: {
              subCategoryId: '$product.subCategoryId',
              subCategoryName: '$subCategory.name',
              subCategoryLogo: '$subCategory.icon'
            },
            category: {
              categoryId: '$subCategory.categoryId',
              categoryName: '$category.name',
              categoryLogo: '$category.icon'
            }
          }
        },
        finalPrice: { $first: '$finalPrice' },
        createdAt: { $first: '$createdAt' },
        updatedAt: { $first: '$updatedAt' }
      }
    },
    { $skip: skip }, // Skip documents for pagination
    { $limit: limit } // Limit the number of documents returned
  ]);
  return orderDetails; // Return the aggregated order details
};

// Store transaction history for an order
export const storeTransactionHistory = async (
  userId,
  orderId,
  amount,
  paymentId,
  status
) => {
  await TransactionHistory.create({
    userId,
    orderId,
    amount,
    paymentId,
    status
  }); // Create a new transaction history document
};

// Process orders and calculate final price, bulk operations, and new order details
export const orderingProducts = async (filteredOrders, products) => {
  const newOrder = [];
  const bulkOps = [];
  let finalPrice = 0;

  for (const order of filteredOrders) {
    const { productId, quantity } = order;
    const product = products.find((item) => item._id.toString() === productId);

    if (product.quantity < quantity) {
      throw new Error(`Insufficient product quantity for product Id ${productId}`);
    }

    // Create bulk write operations for updating product quantities
    const orderPrice = product.price * quantity;
    newOrder.push({
      productId,
      quantity,
      price: orderPrice,
      name: product.name
    });

    finalPrice += orderPrice;
    bulkOps.push({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { quantity: -quantity } }
      }
    });
  }
  return { finalPrice, bulkOps, newOrder }; // Return final price, bulk operations, and new order details
};

// Prepare bulk operations to update product quantities for cancellation
export const cancellingProducts = async (order) => {
  const bulkOps = [];

  for (const item of order.orders) {
    bulkOps.push({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: item.quantity } }
      }
    });
  }
  return bulkOps; // Return bulk operations for cancellation
};
