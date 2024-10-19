/* eslint-disable semi */
import express from 'express';
import { productController } from '~/controllers/productController';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
import verifyToken from '~/middlewares/verifyToken';
import { verifyToken as verifyStaff, isAdmin } from '~/middlewares/verifyRole';

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
Router.get('/price-range', productController.getMinMaxPrices);
Router.get('/search/keyword', productController.getProductsBySearchAndFilter);
Router.get('/search', productController.getProductBySearch);
Router.get('/', productController.getAllProducts);
Router.get('/event/:slug', productController.getProductByEvent);
Router.get('/special', productController.getAllProductsSpecial);
Router.get('/:id', productController.getProductById);
Router.get('/slug/:slug', productController.getProductBySlug);
//Category
Router.get('/category/:id', productController.getProductByCategoryId);
Router.get('/category/slug/:slug', productController.getProductByCategory);
//Brand
Router.get('/brand/:id', productController.getProductByBrandId);
Router.get('/brand/slug/:slug', productController.getProductByBrand);
//Filter
Router.get('/filter/alphabet/az', productController.getProductByAlphabetAZ);
Router.get('/filter/alphabet/za', productController.getProductByAlphabetZA);
Router.get('/filter/price/asc', productController.getProductByPriceAsc);
Router.get('/filter/price/desc', productController.getProductByPriceDesc);
Router.get('/filter/created/newest', productController.getProductByNewest);
Router.get('/filter/created/oldest', productController.getProductByOldest);
//search
//Sort category
Router.get('/:slug/filter', productController.getProductByCategoryFilter);

Router.get('/filter/:slug', productController.getProductsBySlugAndPriceRange);

Router.post(
  '/',
  verifyStaff,
  isAdmin,
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
  verifyStaff,
  isAdmin,
  upload.fields([
    { name: 'images' },
    { name: 'thumbnail' },
    { name: 'imageVariants' },
  ]),
  productController.updateProduct
);
Router.put('/rating/:id', upload.none(), productController.updateRatingProduct);
Router.delete('/:id', verifyStaff, isAdmin, productController.deleteProduct);
Router.delete('/rating/:id', productController.deleteRating);

export const productsApi = Router;
