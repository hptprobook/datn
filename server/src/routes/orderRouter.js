/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';
import { orderController } from '~/controllers/orderController';
const Router = express.Router();

// Carts
Router.get('/', verifyToken, isAdmin, orderController.getAllOrder);
Router.post('/', verifyToken, orderController.addOrder);

// Router.get('/', verifyToken, cartsController.getCurentCart);
// Router.put('/', verifyToken, cartsController.updateCart);
// Router.delete('/', verifyToken, cartsController.removeCart);

// Router.get('/me', verifyToken, (req, res) => {
//   // #swagger.tags = ['Users']
//   // #swagger.summary = 'Get my data...'
//   cartsController.getCurrentUser(req, res);
// });

export const ordersApi = Router;
