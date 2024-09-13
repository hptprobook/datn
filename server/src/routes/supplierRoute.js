/* eslint-disable semi */
import express from 'express';
import { supplierController } from '~/controllers/supplierController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';

const Router = express.Router();

//admin
Router.get('/', verifyToken, verifyAdmin, supplierController.getAllSuppliers);
Router.get(
  '/:id',
  verifyToken,
  verifyAdmin,
  supplierController.getSupplierById
);
Router.post(
  '/add',
  verifyToken,
  verifyAdmin,
  supplierController.createSupplier
);
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  supplierController.deleteSupplier
);
Router.put('/:id', verifyToken, verifyAdmin, supplierController.updateSupplier);

export const suppliersApi = Router;
