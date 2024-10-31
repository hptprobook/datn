import express from 'express';
const Router = express.Router();
import { couponUsageController } from '~/controllers/couponHistoryController';

Router.get('/', couponUsageController.getCouponHistory);
Router.post('/add', couponUsageController.addCouponHistory);
Router.get('/history/:userId', couponUsageController.getCouponHistorybyUserId);

export const couponHistoryApi = Router;

