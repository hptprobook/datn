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

Router.post('/test', orderController.updateStockProducts);

export const ordersApi = Router;
