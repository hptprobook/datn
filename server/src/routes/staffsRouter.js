/* eslint-disable semi */
import express from 'express';
import { staffsController } from '~/controllers/staffsController';
import { isRoot, verifyToken, verifyTokenNoTime } from '~/middlewares/verifyRole';

const Router = express.Router();
// user
Router.get('/', verifyToken, staffsController.getStaffs);
Router.post('/auth/login', staffsController.loginStaff);
Router.get('/auth/me', verifyTokenNoTime, staffsController.getMe);
Router.delete('/:id', verifyToken, isRoot, staffsController.deleteStaff);
Router.post('/', verifyToken, isRoot, staffsController.createStaff);
Router.put('/:id', verifyToken, isRoot, staffsController.updateStaff);
Router.get('/:value', verifyToken, staffsController.getStaffBy);
Router.post('/auth/logout', staffsController.logoutStaff);


export const staffsApi = Router;
