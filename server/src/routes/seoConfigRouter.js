/* eslint-disable semi */
import express from 'express';
import { seoConfigController } from '~/controllers/seoConfigController';
import multer from 'multer';
const Router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/public/imgs');
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
Router.get('/', seoConfigController.getSeoConfig);
Router.post(
    '/',
    upload.single('metaOGImg'),
    seoConfigController.createSeoConfig
);
Router.put(
    '/:id',
    upload.single('metaOGImg'),
    seoConfigController.updateSeoConfig
);
Router.delete('/:id', seoConfigController.deleteSeoConfig);

export const seoConfigApi = Router;