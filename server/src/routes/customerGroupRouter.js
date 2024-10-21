/* eslint-disable semi */
import express from 'express';
const Router = express.Router();
// import { isStaff } from '~/middlewares/verifyRole';
// import verifyToken from '~/middlewares/verifyToken';
import { customerGroupController } from '~/controllers/CustomerGroupController';

//admin
Router.get('/', customerGroupController.getAllCG);
Router.get('/:idCG', customerGroupController.findOneCG);
Router.post('/', customerGroupController.createCG);
Router.post('/addCustomer/:idCG', customerGroupController.adCustomerCG);
Router.put('/:idCG', customerGroupController.updateCG);
Router.delete('/:idCG', customerGroupController.deleteCG);
Router.delete('/delCustomers/:idCG', customerGroupController.removeUserCG);
Router.delete(
    '/delOnceCustomer/:idCG',
    customerGroupController.removeOneUserCG
);

export const customerGroupApi = Router;
