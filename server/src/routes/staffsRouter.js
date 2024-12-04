import express from 'express';
import multer from 'multer';
import { staffsController } from '~/controllers/staffsController';

import {
  verifyTokenNoTime,
  verifyToken,
  isRoot,
} from '~/middlewares/verifyRole';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads/staffs');
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
const Router = express.Router();

Router.get('/auth/me', verifyTokenNoTime, staffsController.getMe);
Router.put('/auth/me', staffsController.addNotify);
Router.post('/auth/login', staffsController.loginStaff);
Router.post('/auth/logout', staffsController.logoutStaff);

Router.use(verifyToken);

Router.route('/')
  .get(isRoot, staffsController.getStaffs)
  .post(isRoot, staffsController.createStaff);

Router.route('/:id')
  .put(isRoot, staffsController.updateStaff)
  .delete(isRoot, staffsController.deleteStaff);
Router.post('/auth/me', upload.single('avatar'), staffsController.updateMe);

Router.get('/:value', staffsController.getStaffBy);
Router.get('/timetables/me', staffsController.getTimetables);
export const staffsApi = Router;
