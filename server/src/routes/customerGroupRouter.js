/* eslint-disable semi */
import express from 'express';
const Router = express.Router();

import { customerGroupController } from '~/controllers/CustomerGroupController';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

//admin
Router.post('/', verifyToken, isAdmin, customerGroupController.createCG);

export const customerGroupApi = Router;
