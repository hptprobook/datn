/* eslint-disable semi */
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
import { blogController } from '~/controllers/blogController';
const Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(process.cwd(), 'uploads/blogs');
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
Router.get('/', blogController.getAllBlogs);

Router.get('/:blogID', blogController.findBlogByID);

Router.post('/', upload.single('thumbnail'), blogController.createBlog);

Router.put('/:blogID', upload.single('thumbnail'), blogController.updateBlog);

Router.delete('/:blogID', blogController.deleteBlog);

export const blogApi = Router;
