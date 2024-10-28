import { Router } from 'express'; // Import the Router function from Express
import {
  createProfile,
  editProfille,
  getProfile,
  getUsers,
  deleteProfile
} from '../../controllers/user/userControllers.js'; // Import user controller functions
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';
import { profileValidation } from '../../utils/validator/profile/profileValidator.js';
import { restrictTo } from '../../middleware/restriction/resrictToMiddileware.js';
import {
  getOrderDetailsOfUser,
  orderDetailsOfUser
} from '../../controllers/order/orderControllers.js'; // Import order controller functions

const userRouter = Router(); // Create a new router instance

// Get the profile for the user
userRouter.get('/get-profile', getProfile);

// Apply authorization middleware to all routes
userRouter.use(auth);

// Get all users in the collection
userRouter.get('/', getUsers);

// Profile routes
// Create a profile for the user with validation
userRouter.post('/create-profile', profileValidation, createProfile);

// Edit the profile for the user
userRouter.post('/edit-profile', editProfille);

// Delete a profile by ID with admin restriction
userRouter.delete('/delete-profile/:profileId', restrictTo('admin'), deleteProfile);

// Fetching order details of a user
userRouter.get('/orderDetails', orderDetailsOfUser); // Get order details of a user

// Get multiple order details of a user
userRouter.post('/multipleOrderDetails', getOrderDetailsOfUser);

export default userRouter; // Export the router instance as the default export
