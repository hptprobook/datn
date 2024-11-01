/* eslint-disable semi */
import express from 'express';
import { receiptController } from '~/controllers/recieptController';
import verifyToken from '~/middlewares/verifyToken';
// import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
const Router = express.Router();

// reciept
Router.get('/', receiptController.getRecieptAll);
Router.get('/:id', receiptController.getReceiptById);
Router.get('/code/:receiptCode', receiptController.getRecieptByCode);

Router.post('/', verifyToken, receiptController.addReceipt);
Router.put('/:id', receiptController.updateReceipt);
Router.delete('/:id', receiptController.delReceipt);
export const receiptsApi = Router;
