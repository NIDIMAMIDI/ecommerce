import { Router } from 'express';
import { auth } from '../../middleware/authorization/authorizationMiddleware.js';
import { restrictTo } from '../../middleware/restriction/resrictToMiddileware.js';
import { deleteUser, getAllUsers } from '../../controllers/admin/adminControllers.js';
import { getOrderDetailsOfUser } from '../../controllers/order/orderControllers.js';
const adminRouter = Router();
adminRouter.use(auth, restrictTo('admin'));
adminRouter.get('/user/list', getAllUsers);
adminRouter.delete('/user/delete/:userId', deleteUser);
adminRouter.get('/user/:userId', getOrderDetailsOfUser);

export default adminRouter;
