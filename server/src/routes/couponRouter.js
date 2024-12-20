/* eslint-disable semi */
import express from 'express';
// import isAdmin from '~/middlewares/verifyAdmin';
import { couponController } from '~/controllers/couponController';
import { verifyToken as verifyStaff, isAdmin } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();
// Payments
Router.get('/', verifyStaff, couponController.getCoupons);
Router.get('/code', couponController.findOneCoupons);
Router.get('/filter', couponController.getCouponsByType);
Router.get('/getForOrder', verifyToken, couponController.getCouponsForOrder);
Router.post(
  '/check-applicability',
  verifyToken,
  couponController.checkCouponApplicability
);
Router.post('/', verifyStaff, couponController.createCoupon);
Router.put('/:id', verifyStaff, couponController.updateCoupon);
Router.delete('/:id', verifyStaff, couponController.deleteCoupon);
Router.post('/many', verifyStaff, isAdmin, couponController.deleteManyCoupon);
Router.post('/creates', verifyStaff, couponController.createManyCoupon);


Router.get('/:id', verifyStaff, couponController.getCouponsById);

export const couponApi = Router;
