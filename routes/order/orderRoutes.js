import { Router } from 'express';
import {
  cancelOrder,
  cancelOrders,
  getOrderDetails,
  orderComplete,
  orderingMultipleProducts,
  placeOrder
} from '../../controllers/order/orderControllers.js';
import { orderValidation } from '../../utils/validator/order/orderValidator.js';
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';
import { restrictTo } from '../../middleware/restriction/resrictToMiddileware.js';
import { schemaValidator } from '../../utils/validator/order/multipleProductsOrder.js';

const orderRouter = Router(); // Create a new router instance

// Apply authorization middleware to all routes
orderRouter.use(auth);

// Route to place a single order with validation
orderRouter.post('/:userId/:productId', orderValidation, placeOrder);

// Route to cancel a specific order by ID
orderRouter.delete('/cancelOrder/:orderId', cancelOrder);

// Route to place multiple orders with validation
orderRouter.post('/:userId', schemaValidator, orderingMultipleProducts);

// Route to cancel multiple orders by ID
orderRouter.delete('/cancelOrders/:orderId', cancelOrders);

// Route to get order details, restricted to admin users
orderRouter.get('/', restrictTo('admin'), getOrderDetails);

// Route to mark an order as complete, restricted to admin users
orderRouter.get('/:orderId/complete', restrictTo('admin'), orderComplete);

export default orderRouter; // Export the router instance as the default export
