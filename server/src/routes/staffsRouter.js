/* eslint-disable semi */
import express from 'express';
import { staffsController } from '~/controllers/staffsController';
import { isRoot, verifyToken, verifyTokenNoTime } from '~/middlewares/verifyRole';

const Router = express.Router();
// user
Router.get('/', verifyToken, staffsController.getStaffs);
Router.post('/login', staffsController.loginStaff);
Router.get('/auth/me', verifyTokenNoTime, staffsController.getMe);

Router.post('/', verifyToken, isRoot, staffsController.createStaff);
Router.get('/:value', verifyToken, staffsController.getStaffBy);


export const staffsApi = Router;
