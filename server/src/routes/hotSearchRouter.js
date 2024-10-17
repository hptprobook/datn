import express from 'express';
const Router = express.Router();
import { hotSearchController } from '~/controllers/hotSearchController';

Router.get('/', hotSearchController.getHotSearch);
Router.post('/', hotSearchController.createHotSearch);
Router.delete('/:id', hotSearchController.deleteHotSearch);
Router.put('/:id', hotSearchController.updateHotSearch);
Router.get('/:id', hotSearchController.plusCountHotSearch);

export const hotSearchApi = Router;
