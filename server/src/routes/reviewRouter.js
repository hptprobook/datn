/* eslint-disable semi */
import express from 'express';
import { reviewController } from '~/controllers/reviewController';
import verifyToken from '~/middlewares/verifyToken';
const Router = express.Router();

// Reviews
Router.post('/', verifyToken, reviewController.addReview);
Router.put('/:idReview', verifyToken, reviewController.updateReview);
Router.delete('/:idReview', verifyToken, reviewController.removeReview);
// Router.get('/me', verifyToken, (req, res) => {
//   // #swagger.tags = ['Users']
//   // #swagger.summary = 'Get my data...'
//   cartsController.getCurrentUser(req, res);
// });

export const reviewsApi = Router;
