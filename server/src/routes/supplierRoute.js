/* eslint-disable semi */
import express from 'express';
import { supplierController } from '~/controllers/supplierController';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();

//admin
Router.get('/', supplierController.getAllSuppliers);
Router.post('/add', supplierController.createSupplier);
Router.delete('/:id', supplierController.deleteSupplier);
Router.put('/:id', supplierController.updateSupplier);

export const suppliersApi = Router;
