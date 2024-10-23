/* eslint-disable semi */
import express from 'express';
import { variantsController } from '~/controllers/variantsController';
import { isAdmin, verifyToken } from '~/middlewares/verifyRole';

const Router = express.Router();

Router.get('/', variantsController.getAllVariants);

Router.post('/', verifyToken, isAdmin, variantsController.createVariant);

Router.put('/:id', verifyToken, isAdmin, variantsController.update);

Router.delete('/:id', verifyToken, isAdmin, variantsController.deleteVariant);

// Delete all
Router.post('/all', verifyToken, isAdmin, variantsController.deleteAllVariant);

Router.post('/many', verifyToken, isAdmin, variantsController.deleteManyVariant);


export const variantsApi = Router;
