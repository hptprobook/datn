/* eslint-disable semi */
import express from 'express';
import { webController } from '~/controllers/webController';
import multer from 'multer';
const Router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '.jpg');
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

//admin
Router.get('/', webController.getWeb);

Router.post(
    '/',
    upload.single('logo'),
    webController.createWeb
);
Router.put(
    '/',
    upload.single('logo'),
    webController.updateWeb
);
// Router.delete('/:id', webController.deleteSeoConfig);

export const webApi = Router;