/* eslint-disable semi */
import express from 'express';
import { productController } from '~/controllers/productController';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
import verifyToken from '~/middlewares/verifyToken';
import verifyAdmin from '~/middlewares/verifyAdmin';

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads/products');
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
Router.get('/', productController.getAllProducts);
Router.get('/:id', productController.getProductById);
Router.get('/slug/:slug', productController.getProductBySlug);
Router.get('/category/:slug', productController.getProductByCategory);
Router.post(
  '/',
  verifyToken,
  verifyAdmin,
  upload.fields([
    { name: 'images' },
    { name: 'thumbnail' },
    { name: 'imageVariants' },
  ]),
  productController.createProduct
);
Router.post('/rating', upload.none(), productController.ratingProduct);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.fields([
    { name: 'images' },
    { name: 'thumbnail' },
    { name: 'imageVariants' },
  ]),
  productController.updateProduct
);
Router.put('/rating/:id', upload.none(), productController.updateRatingProduct);
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);
Router.delete('/rating/:id', productController.deleteRating);

export const productsApi = Router;
