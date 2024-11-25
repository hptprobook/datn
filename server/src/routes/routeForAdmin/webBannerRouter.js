/* eslint-disable semi */
import express from 'express';
import { webBannerController } from '~/controllers/webBannerController';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
const Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(process.cwd(), 'uploads/webBanner');
        uploadModel.ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '.jpg');
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

//admin
Router.get('/', webBannerController.getwebBanner);
Router.post('/', upload.single('image'), webBannerController.createWebBanner);
Router.get('/:webBannerID', webBannerController.getWebBannerById);
Router.put(
    '/:webBannerID',
    upload.single('image'),
    webBannerController.updateWebBanner
);

Router.delete('/:webBannerID', webBannerController.deleteWebBanner);
Router.post('/creates', webBannerController.createManyBanner);

export const webBannerApi = Router;
