import express from 'express';
import { categoryController } from '~/controllers/categoryController';
import multer from 'multer';
import verifyAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads/categories');
    uploadModel.ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.jpg');
  },
});

const upload = multer({ storage });

//admin
Router.get('/', categoryController.getAllCategories);
Router.get('/menu', categoryController.getMenuCategories);
Router.get('/:slug', categoryController.getCategoryBySlug);
Router.get('/:id', categoryController.getCategoryById);
Router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  categoryController.createCategory
);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  categoryController.update
);
Router.delete('/:id', categoryController.deleteCategory);

export const categoriesApi = Router;
