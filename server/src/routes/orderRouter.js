/* eslint-disable semi */
import express from 'express';
import { orderController } from '~/controllers/orderController';

import verifyAdmin from '~/middlewares/verifyAdmin';

import verifyToken from '~/middlewares/verifyToken';
import isAdmin from '~/middlewares/verifyAdmin';
const Router = express.Router();


// Orders
Router.get('/', verifyToken, isAdmin, orderController.getAllOrder);
Router.get('/:id', verifyToken, orderController.getOrderById);
Router.get('/me', verifyToken, orderController.getCurentOrder);


// Carts
Router.get('/', verifyToken, verifyAdmin, orderController.getAllOrder);
Router.get('/me', verifyToken, verifyAdmin, orderController.getAllOrder);

Router.post('/', verifyToken, orderController.addOrder);
Router.put('/:idOrder', verifyToken, orderController.updateOrder);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);

Router.post('/check_stock', verifyToken, orderController.checkStockProducts);

Router.post('/test', orderController.updateStockProducts);

export const ordersApi = Router;