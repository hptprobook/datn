import express from 'express';
import { staffsController } from '~/controllers/staffsController';

import { verifyTokenNoTime, verifyToken, isRoot } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.post('/auth/login', staffsController.loginStaff);
Router.post('/auth/logout', staffsController.logoutStaff);
Router.get('/auth/me', verifyTokenNoTime, staffsController.getMe);

Router.use(verifyToken);

Router.route('/')
    .get(isRoot, staffsController.getStaffs)
    .post(isRoot, staffsController.createStaff);

Router.route('/:id')
    .put(isRoot, staffsController.updateStaff)
    .delete(isRoot, staffsController.deleteStaff);

Router.get('/:value', staffsController.getStaffBy);
Router.get('/timetables/me', staffsController.getTimetables);
export const staffsApi = Router;
