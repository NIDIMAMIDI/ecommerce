import { Router } from 'express';
import { authValidator } from '../../utils/validator/auth/authValidator.js';
import { signup, login, forgotPassWord } from '../../controllers/auth/authControllers.js';
import { getLoginHistoryById } from '../../controllers/loginHistory/loginHistoryControllers.js';
import { restrictTo } from '../../middleware/restriction/resrictToMiddileware.js';
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';
const authRouter = Router();

// Signup Route
authRouter.post('/signup', authValidator, signup);

// Login Route
authRouter.post('/login', authValidator, login);

// Route to get login history by admin
authRouter.get('/login-history', auth, restrictTo('admin'), getLoginHistoryById);

// Forgot password Route
authRouter.post('/forgot-password', forgotPassWord);

export default authRouter;
