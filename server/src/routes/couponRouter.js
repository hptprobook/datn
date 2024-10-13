/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares/verifyToken';
// import isAdmin from '~/middlewares/verifyAdmin';
import { couponController } from '~/controllers/couponController';
import verifyAdmin from '~/middlewares/verifyAdmin';
const Router = express.Router();
// Payments
Router.get('/', verifyToken, couponController.getCoupons);
Router.get('/code', verifyToken, couponController.findOneCoupons);
Router.post('/', verifyToken, couponController.createCoupon);
Router.put('/:id', verifyToken, couponController.updateCoupon);
Router.delete('/:id', verifyToken, couponController.deleteCoupon);
Router.post(
  '/many',
  verifyToken,
  verifyAdmin,
  couponController.deleteManyCoupon
);
// Router.get('/:orderId', verifyToken, couponController.getCurentPayment);

export const couponApi = Router;
