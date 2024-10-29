/* eslint-disable semi */
import express from 'express';
import { receiptController } from '~/controllers/recieptController';
// import verifyToken from '~/middlewares/verifyToken';
// import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
const Router = express.Router();

// reciept
Router.get('/', receiptController.getRecieptAll);
Router.get('/:id', receiptController.getReceiptById);

export const receiptsApi = Router;
