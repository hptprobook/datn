/* eslint-disable semi */
import express from 'express';
import { warehouseController } from '~/controllers/warehouseController';
// import { verifyToken, isAdmin } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.post('/', warehouseController.createWarehouse);
Router.get('/', warehouseController.getAllWarehouses);
Router.get('/:id', warehouseController.getWarehouseById);
Router.get('/products/all', warehouseController.getProducts);

Router.put('/:id', warehouseController.updateWareHouse);
Router.delete('/:id', warehouseController.deleteWareHouse);
Router.post('/creates', warehouseController.creates);
Router.post('/deletes', warehouseController.deletes);
export const warehousesApi = Router;
