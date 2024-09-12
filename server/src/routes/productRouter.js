/* eslint-disable semi */
import express from 'express';
import { productController } from '~/controllers/productController';
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
Router.get('/', productController.getAllProducts);
Router.get('/:id', productController.getProductById);
Router.post(
  '/add',
  upload.fields([{ name: 'images' }, { name: 'varsImg' }]),
  productController.createProduct
);
Router.delete('/:id', productController.deleteProduct);
Router.put(
  '/:id',
  upload.fields([{ name: 'imagesAdd' }, { name: 'varsImg' }]),
  productController.updateProduct
);

export const productsApi = Router;
