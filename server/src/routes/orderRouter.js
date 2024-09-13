/* eslint-disable semi */
import express from 'express';
import { orderController } from '~/controllers/orderController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();

// Carts
Router.get('/', verifyToken, verifyAdmin, orderController.getAllOrder);
Router.get('/me', verifyToken, verifyAdmin, orderController.getAllOrder);
Router.post('/', verifyToken, orderController.addOrder);
Router.post('/check_stock', verifyToken, orderController.checkStockProducts);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);
Router.put('/:idOrder', verifyToken, orderController.updateOrder);

Router.post('/test', orderController.updateStockProducts);

export const ordersApi = Router;
