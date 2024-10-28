/* eslint-disable semi */
import express from 'express';
// import isAdmin from '~/middlewares/verifyAdmin';
import { couponController } from '~/controllers/couponController';
import { verifyToken as verifyStaff, isAdmin } from '~/middlewares/verifyRole';
const Router = express.Router();
// Payments
Router.get('/', verifyStaff, couponController.getCoupons);
Router.get('/code', couponController.findOneCoupons);
Router.get('/filter', couponController.getCouponsByType);
Router.post('/', verifyStaff, couponController.createCoupon);
Router.put('/:id', verifyStaff, couponController.updateCoupon);
Router.delete('/:id', verifyStaff, couponController.deleteCoupon);
Router.post(
  '/many',
  verifyStaff,
  isAdmin,
  couponController.deleteManyCoupon
);


export const couponApi = Router;
