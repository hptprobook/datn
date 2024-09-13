import express from 'express';
import { navDashboardController } from '~/controllers/controllerConfigs/navDashboardController';

const Router = express.Router();

Router.post('/', navDashboardController.createdNavDashboard);
Router.get('/', navDashboardController.getNavDashboard);

export const navDashboardApi = Router;