/* eslint-disable semi */
import express from 'express';
import { timetableController } from '~/controllers/controllerForAdmin/timetableController';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';
const Router = express.Router();

Router.post('/', verifyToken, isAdmin, timetableController.create);
Router.get('/:id', timetableController.findOneBy);
Router.get('/:by/:value', timetableController.findsBy);
Router.get('/', verifyToken, isAdmin, timetableController.getAll);
// Router.put('/:id', timetableController.update);
// Router.delete('/:id', timetableController.remove);

export const timetableApi = Router;