import express from 'express';
import { navDashboardController } from '~/controllers/controllerConfigs/navDashboardController';

const Router = express.Router();

Router.post('/', navDashboardController.createdNavDashboard);
Router.get('/', navDashboardController.getNavDashboard);
Router.delete('/:id', navDashboardController.removeNavDashboard);
Router.put('/:id', navDashboardController.updateNavDashboard);

export const navDashboardApi = Router;