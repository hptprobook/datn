/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import { verifyToken as verifyStaff } from '~/middlewares/verifyRole';
import verifyToken from '~/middlewares/verifyToken';
import multer from 'multer';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads/user');
    uploadModel.ensureDirExists(uploadPath);
    cb(null, uploadPath);
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

// user
Router.get('/me', verifyToken, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my data...'
  usersController.getCurrentUser(req, res);
});
Router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  usersController.getCurrentAdmin(req, res);
});

Router.get('/:id', usersController.getUserById);
//notifies
Router.get('/notifies/:id', usersController.getNotifiesUserById);
Router.get('/email/:email', usersController.getUserByEmail);

Router.put('/me', verifyToken, usersController.updateCurrentUser);
Router.put('/me/password', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyStaff, usersController.getAllUsers);
Router.put('/:id', verifyStaff, usersController.updateUser);
Router.delete('/:id', verifyStaff, usersController.deleteUser);
Router.post('/', verifyStaff, usersController.createUser);

// favorite + views
// Router.put('/me/favorites', usersController.addProductToFavorites);
// Router.get('/me/views', usersController.addProductToViews);

// cart
Router.put('/me/addCart', verifyToken, usersController.addCartToCurrent);
Router.put('/me/removeCart', verifyToken, usersController.removeCartToCurrent);

//read
Router.post('/notify/:id', usersController.readNotify);
Router.post('/notifies', usersController.readAllNotifies);

//favorite
Router.post('/favorite/:id', usersController.favoriteProduct);
Router.post('/view/:id', usersController.viewProduct);
// update Infor
Router.put(
  '/me/infor',
  verifyToken,
  upload.single('avatar'),
  usersController.updateInfor
);

export const usersApi = Router;
