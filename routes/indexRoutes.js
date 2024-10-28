import { Router } from 'express';
import userRouter from './user/userRotes.js';
import authRouter from './auth/authRoutes.js';
import categoryRouter from './category/categoryRoutes.js';
import productRouter from './product/productRoutes.js';
import orderRouter from './order/orderRoutes.js';
import uploadRouter from './upload/uploadFileRoutes.js';
import cardRouter from './card/cardRoutes.js';
import adminRouter from './admin/adminRoutes.js';

const router = Router(); // Create a new router instance

// Set up routes for different modules
router.use('/users', userRouter); // Mount user routes at /users
router.use('/auth', authRouter); // Mount authentication routes at /auth
router.use('/category', categoryRouter); // Mount category routes at /category
router.use('/product', productRouter); // Mount product routes at /product
router.use('/order', orderRouter); // Mount order routes at /order
router.use('/upload', uploadRouter); // Mount upload routes at /upload
router.use('/card', cardRouter); // Mount card routes at /card
router.use('/admin', adminRouter);

export default router; // Export the router instance as the default export
