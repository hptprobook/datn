/* eslint-disable semi */
import express from 'express';
import { brandController } from '~/controllers/brandController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import { isAdmin } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';
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

Router.get('/', brandController.getAllBrands);
Router.get('/:id', brandController.getBrandById);
Router.post('/', upload.single('image'), brandController.createBrand);
Router.put('/:id', upload.single('image'), brandController.update);
Router.delete('/:id', brandController.deleteBrand);

export const brandsApi = Router;
