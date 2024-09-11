/* eslint-disable semi */
import express from 'express';
import { inventoryController } from '~/controllers/inventoryController';
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

Router.get('/', inventoryController.getAllInventories);
Router.get('/:id', inventoryController.getInventoryById);
Router.post('/add', upload.none(), inventoryController.createInventory);
Router.put('/:id', upload.none(), inventoryController.updateInventory);
Router.delete('/:id', inventoryController.deleteInventory);

export const inventoriesApi = Router;
