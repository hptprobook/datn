/* eslint-disable semi */
import express from 'express';
import { staffsController } from '~/controllers/staffsController';
import { isRoot } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';

const Router = express.Router();
// user
Router.post('/', verifyToken, isRoot, staffsController.createStaff);

export const staffsApi = Router;
