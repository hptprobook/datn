import express from 'express';
import { navDashboardController } from '~/controllers/controllerForAdmin/navDashboardController';

const Router = express.Router();

Router.post('/', navDashboardController.createdNavDashboard);
Router.get('/', navDashboardController.getNavDashboard);
Router.delete('/:id', navDashboardController.removeNavDashboard);
Router.put('/:id', navDashboardController.updateNavDashboard);
Router.get('/:id', navDashboardController.getNavDashboardById);
Router.patch('/', navDashboardController.updateMultipleNav);

export const navDashboardApi = Router;