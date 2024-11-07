/* eslint-disable semi */
import express from 'express';
import { warehouseReceiptController } from '~/controllers/controllerForAdmin/warehouseReceiptController';

import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.get('/', warehouseReceiptController.getAllOrder);
Router.get('/find/:by/:value', warehouseReceiptController.findBy);

Router.post('/', verifyToken, isAdmin, warehouseReceiptController.add);
Router.put('/:id', warehouseReceiptController.updateOrder);
Router.delete('/:id', verifyToken, isAdmin, warehouseReceiptController.remove);

export const warehouseReceiptAPI = Router;
