/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares';
// import isAdmin from '~/middlewares/isAdmin';
import { cartsController } from '~/controllers/cartController';
const Router = express.Router();

// Carts
Router.get('/', verifyToken, cartsController.getCurentCart);
Router.post('/', verifyToken, cartsController.addCart);
Router.put('/', verifyToken, cartsController.updateCart);
Router.delete('/', verifyToken, cartsController.removeCart);

// Router.get('/me', verifyToken, (req, res) => {
//   // #swagger.tags = ['Users']
//   // #swagger.summary = 'Get my data...'
//   cartsController.getCurrentUser(req, res);
// });

export const cartsApi = Router;
