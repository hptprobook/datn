/* eslint-disable semi */
import express from 'express';
import { brandController } from '~/controllers/brandController';
import multer from 'multer';
import { uploadModel } from '~/models/uploadModel';
import path from 'path';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads/brands');
    uploadModel.ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '.jpg');
  },
});

const upload = multer({ storage });

Router.get('/', brandController.getAllBrands);
Router.get('/:id', brandController.getBrandById);
Router.get('/slug/:slug', brandController.getBrandBySlug);
Router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('image'),
  brandController.createBrand
);
Router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('image'),
  brandController.update
);
Router.delete('/:id', verifyToken, isAdmin, brandController.deleteBrand);
//Delete all
Router.post('/all', verifyToken, isAdmin, brandController.deleteAllBrand);
Router.post('/many', verifyToken, isAdmin, brandController.deleteManyBrand);
Router.post('/creates', verifyToken, isAdmin, brandController.createManyBrands);

export const brandsApi = Router;
