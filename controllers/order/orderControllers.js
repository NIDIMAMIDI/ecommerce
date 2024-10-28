import { MultipleProductsOrder } from '../../model/order/multipleProductsOrder.js';
import { Order } from '../../model/order/orderModel.js';
import { Product } from '../../model/product/productModel.js';
import mongoose from 'mongoose';
import { createCharge } from '../../helpers/stripe/createChargeHelper.js';
import { refundMoney } from '../../helpers/stripe/createRefundHelper.js';
import {
  multipleOrderDetails,
  fetchOrderDetails,
  storeTransactionHistory,
  orderingProducts,
  cancellingProducts
} from '../../helpers/order/orderHelpers.js';
import {
  cancellationEmail,
  orderConformationMail,
  orderPlaceMail,
  refundMail
} from '../../helpers/email/emailSendHelper.js';

// Place a single product order

export const placeOrder = async (req, res, next) => {
  try {
    const { userId, productId } = req.params; // Get userId and productId from request params
    const { quantity } = req.body; // Get quantity from request body
    const product = await Product.findById(productId); // Find the product by productId
    if (!product) {
      return res.status(404).json({
        status: 'failure',
        message: 'Product not found'
      });
    }
    // checking provided quantity is available in prodcts
    if (product.quantity < quantity) {
      return res.status(404).json({
        status: 'failure',
        message: 'Insufficient product quantity'
      });
    }
    const amount = product.price * quantity; // Calculate total amount
    const charge = await createCharge(amount, userId); // Create charge using Stripe
    // create new order
    const newOrder = await Order.create({
      userId,
      productId,
      chargeId: charge.id,
      quantity,
      price: amount,
      name: product.name
    });
    // Store transaction history
    storeTransactionHistory(userId, newOrder._id, amount, charge.id, charge.status);
    product.quantity = product.quantity - quantity; // Update product quantity
    await product.save(); // Save updated product
    orderPlaceMail(userId, newOrder); // Send order placement email
    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      orderDetails: {
        newOrder
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Cancel a single product order

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get orderId from request params
    const order = await Order.findById(orderId); // Find order by orderId
    if (!order) {
      return res.status(404).json({
        status: 'failure',
        message: 'Order details not found'
      });
    }
    const userId = order.userId.toString(); // Convert userId to string for comparison
    // if user is authorized user and userid is equal is equal to user id in collection
    if (req.user && req.user.id !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to cancel this order'
      });
    }
    const orderQuantity = order.quantity; // Get order quantity
    const productId = order.productId; // Get productId from order details
    const product = await Product.findById(productId); // Find product by productId
    if (!product) {
      return res.status(404).json({
        status: 'failure',
        message: 'Product not found'
      });
    }
    product.quantity = product.quantity + orderQuantity; // Update product quantity
    await product.save(); // Save updated product
    const refund = await refundMoney(order.chargeId); // Refund money using Stripe
    // Store transaction history
    storeTransactionHistory(userId, orderId, order.price, refund.id, refund.status);
    await Order.findByIdAndDelete(orderId); // Delete order
    refundMail(userId, order); // Send refund email
    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully, Money refunded to your account'
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Get details of all orders

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.find(); // Find all orders
    if (!order) {
      return res.status(404).json({
        status: 'failure',
        message: 'Order details not found'
      });
    }
    res.status(200).json({
      status: 'success',
      orderDetails: {
        order
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Mark an order as complete

export const orderComplete = async (req, res, next) => {
  const { orderId } = req.params; // Get orderId from request params
  const order = await Order.findById(orderId); // Find order by orderId
  if (!order) {
    return res.status(404).json({
      status: 'failure',
      message: 'Order details not found'
    });
  }
  if (order.status === 'completed') {
    return res.status(500).json({
      status: 'failure',
      message: 'Order has already been completed'
    });
  }
  order.status = 'completed'; // Mark order as completed
  await order.save(); // Save updated order
  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
};

// Get order details of a specific user

export const orderDetailsOfUser = async (req, res) => {
  try {
    // Get the user detials from the authorization middleware
    const userId = req.user._id;

    const orderDetails = await fetchOrderDetails(userId); // Fetch order details using aggregation pipeline
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({
        status: 'failure',
        message: 'User does not have any orders'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        orderDetails
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Get paginated order details of a specific user

export const getOrderDetailsOfUser = async (req, res, next) => {
  try {
    // Get the user detials from the authorization middleware
    let userId = req.user._id;

    // If the user is an admin, get userId from request parameters
    if (req.user.role === 'admin') {
      userId = new mongoose.Types.ObjectId(req.params.userId);
    }

    const page = parseInt(req.body.page) || 1; // Get page number from request body, default to 1
    const limit = parseInt(req.body.limit) || 10; // Get limit from request body, default to 5
    const skip = (page - 1) * limit; // Calculate skip value
    // Fetch paginated order details using aggregation pipeline
    const orderDetails = await multipleOrderDetails(userId, skip, limit);
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({
        status: 'failure',
        message: 'No orders found for the user'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        orderDetails
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Place multiple products order
export const orderingMultipleProducts = async (req, res, next) => {
  try {
    const { userId } = req.params; // Get userId from request params
    const { orders } = req.body; // Get orders array from request body
    const productIds = orders.map((order) => order.productId); // Extract product IDs from orders array
    const products = await Product.find({ _id: { $in: productIds } }); // Find products by productIds
    // Create a set of existing product IDs for quick lookup
    const existingProductIds = new Set(products.map((product) => product._id.toString()));
    const filteredOrders = orders.filter((order) =>
      existingProductIds.has(order.productId)
    ); // Filter orders to include only those with valid product IDs
    if (filteredOrders.length === 0) {
      return res.status(404).json({
        status: 'failure',
        message: 'No valid products found for the order'
      });
    }
    const { finalPrice, bulkOps, newOrder } = await orderingProducts(
      filteredOrders,
      products
    ); // Process orders and calculate final price, bulk operations, and new order details
    await Product.bulkWrite(bulkOps); // Execute bulk operations to update product quantities
    const charge = await createCharge(finalPrice, userId); // Create charge using Stripe
    const order = await MultipleProductsOrder.create({
      userId,
      orders: newOrder,
      chargeId: charge.id,
      finalPrice
    }); // Create multiple products order
    // Store transaction history
    storeTransactionHistory(userId, order._id, finalPrice, charge.id, charge.status);
    orderConformationMail(userId, order); // Send order confirmation email
    res.status(201).json({
      status: 'success',
      orderDetails: {
        order
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Cancel multiple products order
export const cancelOrders = async (req, res, next) => {
  try {
    const { orderId } = req.params; // Get orderId from request params
    const order = await MultipleProductsOrder.findById(orderId); // Find multiple products order by orderId
    if (!order) {
      return res.status(404).json({
        status: 'failure',
        message: 'Order not found'
      });
    }
    const userId = order.userId.toString(); // Convert userId to string for comparison
    if (req.user && req.user.id !== userId) {
      return res.status(403).json({
        status: 'failure',
        message: 'You are not authorized to cancel this order'
      });
    }
    const bulkOps = await cancellingProducts(order); // Prepare bulk operations to update product quantities
    await Product.bulkWrite(bulkOps); // Execute bulk operations to update product quantities
    const refund = await refundMoney(order.chargeId); // Refund money using Stripe
    await MultipleProductsOrder.findByIdAndDelete(orderId); // Delete multiple products order
    await storeTransactionHistory(
      userId,
      orderId,
      order.finalPrice,
      refund.id,
      refund.status
    ); // Store transaction history
    await cancellationEmail(userId, order); // Send cancellation email
    res.status(200).json({
      status: 'success',
      message: 'Order canceled successfully, Money has been refunded successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
