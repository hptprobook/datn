/* eslint-disable semi */
import express from 'express';
import { dashboardController } from '~/controllers/controllerForAdmin/dashboardController';
const Router = express.Router();
Router.get('/users', dashboardController.userStatistics);

export const dashboardApi = Router;