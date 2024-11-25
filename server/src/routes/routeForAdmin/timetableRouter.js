/* eslint-disable semi */
import express from 'express';
import { timetableController } from '~/controllers/controllerForAdmin/timetableController';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';
const Router = express.Router();

Router.use(verifyToken); // áp dụng verifyToken cho tất cả các tuyến đường

Router.route('/')
    .post(isAdmin, timetableController.create)
    .get(isAdmin, timetableController.getAll);

Router.route('/:id')
    .get(timetableController.findOneBy)
    .put(isAdmin, timetableController.update)
    .delete(isAdmin, timetableController.remove);

export const timetableApi = Router;