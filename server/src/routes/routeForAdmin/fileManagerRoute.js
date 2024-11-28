/* eslint-disable semi */
import express from 'express';
import multer from 'multer';
import { fileManagerController } from '~/controllers/controllerForAdmin/fileManagerController';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(process.cwd(), 'uploads/');
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
const Router = express.Router();
Router.get('/', fileManagerController.getFolder);
Router.get('/:folder', fileManagerController.getFiles);
Router.post('/upload',
    upload.single('file'),
    fileManagerController.uploadFile);
Router.post('/delete', fileManagerController.deleteFile);

export const fileManagerApi = Router;