/* eslint-disable semi */
import express from 'express';
import { brandController } from '~/controllers/brandController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import { isAdmin } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();

// Carts
Router.get('/', brandController.getAllBrands);
Router.post('/', brandController.createBrand);
Router.put('/', brandController.updateInventory);
Router.delete('/', brandController.deleteInventory);

export const cartsApi = Router;
