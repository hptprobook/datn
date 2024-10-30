/* eslint-disable semi */
import express from 'express';
import { goodsOrderController } from '~/controllers/goodsOrdersController';

import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.get('/', goodsOrderController.getAllOrder);
Router.get('/:id', goodsOrderController.getOrderById);
Router.get('/code/:orderCode', goodsOrderController.findOrderByCode);

Router.post('/', goodsOrderController.addOrder);
Router.put('/:id', goodsOrderController.updateOrder);
Router.delete('/:idOrder', goodsOrderController.removeOrder);

export const goodsOrdersApi = Router;
