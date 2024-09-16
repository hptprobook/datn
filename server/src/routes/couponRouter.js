/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares/verifyToken';
// import isAdmin from '~/middlewares/verifyAdmin';
import { couponController } from '~/controllers/couponController';
const Router = express.Router();
// Payments
Router.get('/', verifyToken, couponController.getCoupons);
Router.get('/code', verifyToken, couponController.findOneCoupons);
Router.post('/', verifyToken, couponController.createCoupon);
Router.put('/:idCoupon', verifyToken, couponController.updateCoupon);
Router.delete('/:idCoupon', verifyToken, couponController.deleteCoupon);
// Router.get('/:orderId', verifyToken, couponController.getCurentPayment);

export const couponApi = Router;