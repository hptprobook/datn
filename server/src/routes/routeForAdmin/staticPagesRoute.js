/* eslint-disable semi */
import express from 'express';
import { staticPageController } from '~/controllers/controllerForAdmin/staticPageController';
const Router = express.Router();

// Router.get('/', seoConfigController.getSeoConfig);
Router.post('/', staticPageController.create);
Router.get('/:value', staticPageController.getBy);
Router.get('/', staticPageController.gets);
Router.put('/:id', staticPageController.update);
Router.delete('/:id', staticPageController.remove);
Router.post('/creates', staticPageController.creates);
Router.post('/deletes', staticPageController.deletes);

export const staticPageApi = Router;