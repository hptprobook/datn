import express from 'express';
const Router = express.Router();
import { couponUsageController } from '~/controllers/couponHistoryController';

Router.get('/', couponUsageController.getCouponHistory);
Router.post('/add', couponUsageController.addCouponHistory);
Router.post('/history', couponUsageController.getCouponHistoryByParams);


export const couponHistoryApi = Router;

