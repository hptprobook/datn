/* eslint-disable semi */
import express from 'express';
import { warehouseController } from '~/controllers/warehouseController';
import verifyToken from '~/middlewares/verifyToken';
import verifyAdmin from '~/middlewares/verifyAdmin';

const Router = express.Router();

Router.get('/', warehouseController.getAllWarehouses);
Router.get('/:id', warehouseController.getWarehouseById);
Router.get('/name/:name', warehouseController.getWarehouseByName);
Router.post('/', verifyToken, verifyAdmin, warehouseController.createWarehouse);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  warehouseController.updateInventory
);
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  warehouseController.deleteInventory
);

export const warehousesApi = Router;
