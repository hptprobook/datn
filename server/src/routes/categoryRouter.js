/* eslint-disable semi */
import express from "express";
import verifyToken from "~/middlewares";
import isAdmin from "~/middlewares/isAdmin";
import { categoryController } from "~/controllers/categoryController";

const Router = express.Router();
// Router.get('/me', verifyToken, (req, res) => {
//   categoryController.getCurrentUser(res, req);
// });
Router.get("/test", categoryController.test);

Router.post("/", (req, res) => {
  categoryController.createCategory(req, res);
});

// Router.get('/:id', categoryController.getUserById);
// Router.get('/email/:email', categoryController.getUserByEmail);
// Router.post('/login', categoryController.login);
// Router.put('/me', verifyToken, categoryController.updateCurrentUser);
// Router.put('/me/password', verifyToken, categoryController.changePassWord);

// // admin
// Router.get('/', verifyToken, isAdmin, categoryController.getAllUsers);
// Router.put('/:id', verifyToken, isAdmin, categoryController.updateUser);
// Router.delete('/:id', verifyToken, isAdmin, categoryController.deleteUser);

export const categoriesApi = Router;
