/* eslint-disable semi */
import express from 'express';
import { fileManagerController } from '~/controllers/controllerForAdmin/fileManagerController';
const Router = express.Router();
Router.get('/', fileManagerController.getFolder);
Router.get('/:folder', fileManagerController.getFiles);

export const fileManagerApi = Router;