/* eslint-disable semi */
import express from 'express';
import { orderController } from '~/controllers/orderController';

import verifyAdmin from '~/middlewares/verifyAdmin';

import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();

// Orders
Router.get('/', verifyToken, verifyAdmin, orderController.getAllOrder);
Router.get('/:id', verifyToken, orderController.getOrderById);
Router.get('/me/current', verifyToken, orderController.getCurrentOrder);

// Carts
Router.get('/', verifyToken, verifyAdmin, orderController.getAllOrder);

Router.post('/', verifyToken, orderController.addOrder);
Router.put('/:id', verifyToken, orderController.updateOrder);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);
Router.post('/check_stock', verifyToken, orderController.checkStockProducts);
Router.post('/update_stock', verifyToken, orderController.updateStockProducts);
// notlogin
Router.get('/not/:orderCode', orderController.findOrderByCode);
Router.post('/not', orderController.addOrderNot);
Router.put('/not/:id', orderController.updateOrder);
Router.delete('/not/:idOrder', orderController.removeOrder);

export const ordersApi = Router;
