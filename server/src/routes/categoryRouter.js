/* eslint-disable semi */
import express from 'express';
import { categoryController } from '~/controllers/categoryController';
import multer from 'multer';
import verifyAdmin from '~/middlewares/verifyAdmin';
import { isAdmin } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';

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
Router.get('/', verifyToken, verifyAdmin, categoryController.getAllCategories);
Router.get('/menu', categoryController.getMenuCategories);
Router.get('/:slug', categoryController.getCategoryBySlug);
Router.get(
  '/:id',
  verifyToken,
  verifyAdmin,
  categoryController.getCategoryById
);
Router.post(
  '/add',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  categoryController.createCategory
);
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  categoryController.deleteCategory
);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  categoryController.updateCategory
);

export const categoriesApi = Router;
