/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares/verifyToken';
// import isAdmin from '~/middlewares/verifyAdmin';
import { paymentController } from '~/controllers/paymentController';
const Router = express.Router();
// Payments
Router.get('/', verifyToken, paymentController.getAllPayment);
Router.get('/:orderId', verifyToken, paymentController.getCurentPayment);
Router.post('/', verifyToken, paymentController.createPayment);
Router.put('/:idPayment', verifyToken, paymentController.updatePayment);
Router.delete('/:idPayment', verifyToken, paymentController.removePayment);

export const paymentApi = Router;