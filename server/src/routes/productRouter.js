/* eslint-disable semi */
import express from 'express';
import { productController } from '~/controllers/productController';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';
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
Router.post('/add', upload.array('images'), productController.createProduct);
Router.delete('/:id', productController.deleteProduct);
Router.put('/:id', upload.array('images'), productController.updateProduct);

export const productsApi = Router;
