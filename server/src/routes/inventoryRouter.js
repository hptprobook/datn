/* eslint-disable semi */
import express from 'express';
import { inventoryController } from '~/controllers/inventoryController';
import multer from 'multer';
import verifyToken from '~/middlewares/verifyToken';
import verifyAdmin from '~/middlewares/verifyAdmin';

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

Router.get(
  '/',
  verifyToken,
  verifyAdmin,
  inventoryController.getAllInventories
);
Router.get(
  '/:id',
  verifyToken,
  verifyAdmin,
  inventoryController.getInventoryById
);
Router.post(
  '/add',
  verifyToken,
  verifyAdmin,
  upload.none(),
  inventoryController.createInventory
);
Router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  upload.none(),
  inventoryController.updateInventory
);
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  inventoryController.deleteInventory
);

export const inventoriesApi = Router;
