/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';
import { orderController } from '~/controllers/orderController';
const Router = express.Router();

// Carts
Router.get('/', verifyToken, isAdmin, orderController.getAllOrder);
Router.get('/me', verifyToken, isAdmin, orderController.getAllOrder);
Router.post('/', verifyToken, orderController.addOrder);
Router.post('/check_stock', verifyToken, orderController.checkStockProducts);
Router.delete('/:idOrder', verifyToken, orderController.removeOrder);
Router.put('/:idOrder', verifyToken, orderController.updateOrder);

Router.post('/test', orderController.updateStockProducts);

// Router.get('/me', verifyToken, (req, res) => {
//   // #swagger.tags = ['Users']
//   // #swagger.summary = 'Get my data...'
//   cartsController.getCurrentUser(req, res);
// });

export const ordersApi = Router;
