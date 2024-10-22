/* eslint-disable semi */
import express from 'express';
import { warehouseController } from '~/controllers/warehouseController';
// import { verifyToken, isAdmin } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.post('/', warehouseController.createWarehouse);
Router.get('/', warehouseController.getAllWarehouses);
Router.get('/:id', warehouseController.getWarehouseById);
Router.get('/products/all', warehouseController.getProducts);

Router.put('/:id', warehouseController.updateInventory);
Router.delete('/:id', warehouseController.deleteInventory);

export const warehousesApi = Router;
