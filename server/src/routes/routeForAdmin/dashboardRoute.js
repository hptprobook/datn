/* eslint-disable semi */
import express from 'express';
import { dashboardController } from '~/controllers/controllerForAdmin/dashboardController';
const Router = express.Router();
Router.get('/users', dashboardController.userStatistics);
Router.get('/receipts', dashboardController.receiptStatistics);
Router.get('/products', dashboardController.productsStatistics);
Router.get('/orders/7day', dashboardController.orders7DayStatistics);
Router.get('/receipts/filter', dashboardController.receiptFilterStatistics);

export const dashboardApi = Router;