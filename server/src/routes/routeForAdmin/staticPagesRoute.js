/* eslint-disable semi */
import express from 'express';
import { staticPageController } from '~/controllers/controllerForAdmin/staticPageController';
const Router = express.Router();

// Router.get('/', seoConfigController.getSeoConfig);
Router.post('/', staticPageController.create);



export const staticPageApi = Router;