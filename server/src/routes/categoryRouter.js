/* eslint-disable semi */
import express from 'express';
import { categoryController } from '~/controllers/categoryController';
import multer from 'multer';

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/imgs');
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
Router.get('/', categoryController.getAllCategories);
Router.get('/:id', categoryController.getCategoryById);
Router.post('/add', upload.single('image'), categoryController.createCategory);
Router.delete('/:id', categoryController.deleteCategory);
Router.put('/:id', upload.single('image'), categoryController.updateCategory);

export const categoriesApi = Router;
