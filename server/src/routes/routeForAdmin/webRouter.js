/* eslint-disable semi */
import express from 'express';
import { webController } from '~/controllers/webController';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
import { verifyToken } from '~/middlewares/verifyRole';
const Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(process.cwd(), 'uploads/web');
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
Router.get('/', webController.getWeb);

Router.put('/', verifyToken, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'darkLogo', maxCount: 1 },
    { name: 'eventBanner', maxCount: 1 },
    { name: 'loginScreen', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
]), webController.updateWeb);
// Router.delete('/:id', webController.deleteSeoConfig);

export const webApi = Router;
