/* eslint-disable semi */
import express from 'express';
import { variantsController } from '~/controllers/variantsController';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.get('/', variantsController.getAllVariants);
Router.post('/', isAdmin, verifyToken, variantsController.createVariant);
Router.put('/:id', isAdmin, verifyToken, variantsController.update);
Router.delete('/:id', isAdmin, verifyToken, variantsController.deleteVariant);
//Delete all
Router.post('/all', isAdmin, verifyToken, variantsController.deleteAllVariant);
Router.post(
  '/many',
  isAdmin,
  verifyToken,
  variantsController.deleteManyVariant
);

export const variantsApi = Router;
