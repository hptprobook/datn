/* eslint-disable semi */
import express from 'express';
import { orderController } from '~/controllers/orderController';

import verifyToken from '~/middlewares/verifyToken';
import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
const Router = express.Router();

// Orders
Router.get('/', verifyStaff, orderController.getAllOrder);
Router.get('/:id', orderController.getOrderById);
Router.get('/me/current', verifyToken, orderController.getCurrentOrder);
Router.get('/me/:orderCode', verifyToken, orderController.getOrderByCode);

// Carts
Router.get('/', verifyStaff, orderController.getAllOrder);

Router.post('/', verifyToken, orderController.addOrder);
Router.put('/:id', verifyToken, orderController.updateOrder);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);
Router.post('/check_stock', orderController.checkStockProducts);
Router.post('/update_stock', verifyToken, orderController.updateStockProducts);
// not login
Router.get('/not/:orderCode', orderController.findOrderByCode);
Router.post('/not', orderController.addOrderNot);
Router.put('/not/:id', orderController.updateOrderNotLogin);
Router.delete('/not/:idOrder', orderController.removeOrder);
// at store
Router.post('/store', verifyToken, orderController.addOrderAtStore);
Router.put('/store/:id', orderController.updateOrderAtStore);
Router.delete('/store/:idOrder', orderController.removeOrderAtStore);

export const ordersApi = Router;
