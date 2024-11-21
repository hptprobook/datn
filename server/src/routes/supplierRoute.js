/* eslint-disable semi */
import express from 'express';
import { supplierController } from '~/controllers/supplierController';
import { verifyToken, isAdmin } from '~/middlewares/verifyRole';

const Router = express.Router();

//admin
Router.get('/', verifyToken, isAdmin, supplierController.getAllSuppliers);
Router.get(
  '/:id',
  verifyToken,
  isAdmin,
  supplierController.getSupplierById
);
Router.post('/', verifyToken, isAdmin, supplierController.createSupplier);
Router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  supplierController.deleteSupplier
);
Router.post(
  '/all',
  verifyToken,
  isAdmin,
  supplierController.deleteAllSupplier
);
Router.post(
  '/many',
  verifyToken,
  isAdmin,
  supplierController.deleteManySupplier
);
Router.post(
  '/creates',
  verifyToken,
  isAdmin,
  supplierController.createManySuppliers
);

Router.put('/:id', verifyToken, isAdmin, supplierController.updateSupplier);


export const suppliersApi = Router;
