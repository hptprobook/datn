/* eslint-disable semi */
import express from 'express';
import { cartsController } from '~/controllers/cartController';
import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();

// Carts
Router.get('/', verifyToken, cartsController.getCurentCart);
Router.post('/', verifyToken, cartsController.addCart);
Router.post('/combine', verifyToken, cartsController.addMultipleCarts);
Router.put('/', verifyToken, cartsController.updateCart);
Router.delete('/', verifyToken, cartsController.removeCart);

// Remove the commented out block of code

export const cartsApi = Router;
