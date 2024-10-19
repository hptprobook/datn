/* eslint-disable semi */
import express from 'express';
import { warehouseController } from '~/controllers/warehouseController';
import { verifyToken, isAdmin } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.get('/', warehouseController.getAllWarehouses);
Router.get('/:id', warehouseController.getWarehouseById);
Router.get('/name/:name', warehouseController.getWarehouseByName);
Router.post('/', verifyToken, isAdmin, warehouseController.createWarehouse);
Router.put(
  '/:id',
  verifyToken,
  isAdmin,
  warehouseController.updateInventory
);
Router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  warehouseController.deleteInventory
);

export const warehousesApi = Router;
