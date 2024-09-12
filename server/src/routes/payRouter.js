/* eslint-disable semi */
import express from 'express';
// import verifyToken from '~/middlewares';
import { vnpayController } from '~/controllers/vnpayController';
const Router = express.Router();

// Pay
Router.post('/vnpay', (req, res) => {
  // #swagger.tags = ['Pay']
  // #swagger.summary = 'Pay to vnPay...'
  vnpayController.getUrlVnPay(req, res);
});
Router.post('/vnpay/check', (req, res) => {
  // #swagger.tags = ['Pay']
  // #swagger.summary = 'Pay check by VnPay...'
  vnpayController.vnpay_return(req, res);
});

export const paysApi = Router;
