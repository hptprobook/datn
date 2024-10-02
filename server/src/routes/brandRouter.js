/* eslint-disable semi */
import express from 'express';
import { brandController } from '~/controllers/brandController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';
import multer from 'multer';
import { uploadModel } from '~/models/uploadModel';
import path from 'path';

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
  verifyAdmin,
  upload.single('image'),
  brandController.createBrand
);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.single('image'),
  brandController.update
);
Router.delete('/:id', verifyToken, verifyAdmin, brandController.deleteBrand);
//Delete all
Router.post('/all', verifyToken, verifyAdmin, brandController.deleteAllBrand);

export const brandsApi = Router;
