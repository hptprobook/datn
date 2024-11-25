import express from 'express';
import { categoryController } from '~/controllers/categoryController';
import multer from 'multer';
import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
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
Router.get('/slug/:slug', categoryController.getCategoryBySlug);
Router.get('/:slug/views', categoryController.increaseViews);
Router.get('/getByView', categoryController.getCategoryByViews);
Router.get('/:id', categoryController.getCategoryById);
Router.post(
  '/',
  verifyStaff,
  upload.single('image'),
  categoryController.createCategory
);
Router.put(
  '/:id',
  verifyStaff,
  upload.single('image'),
  categoryController.update
);
Router.delete('/:id', verifyStaff, categoryController.deleteCategory);
Router.post('/many', verifyStaff, categoryController.deleteManyCategory);
Router.post('/creates', verifyStaff, categoryController.creates);

export const categoriesApi = Router;
