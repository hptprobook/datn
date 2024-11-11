/* eslint-disable semi */
import express from 'express';
import { orderController } from '~/controllers/orderController';

import verifyToken from '~/middlewares/verifyToken';
import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
const Router = express.Router();

// Orders
Router.get('/', orderController.getAllOrder);
Router.get('/all/status', verifyToken, orderController.getOrderByStatus);
// Router.get('/', verifyToken, orderController.getAllOrder);
Router.get('/:id', orderController.getOrderById);
Router.get('/me/current', verifyToken, orderController.getCurrentOrder);
Router.get('/me/code/:orderCode', verifyToken, orderController.getOrderByCode);
Router.get('/me/status', verifyToken, orderController.getCurrentOrderByStatus);

// Carts
Router.post('/', verifyToken, orderController.addOrder);

Router.put('/:id', verifyStaff, orderController.updateOrder);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);
Router.post('/check_stock', orderController.checkStockProducts);
Router.post('/update_stock', verifyToken, orderController.updateStockProducts);
// not login
Router.post('/not', orderController.addOrderNot);
Router.get('/not/:orderCode', orderController.findOrderByCode);
Router.put('/not/:id', orderController.updateOrderNotLogin);
Router.delete('/not/:idOrder', orderController.removeOrder);
// at store
export const ordersApi = Router;
