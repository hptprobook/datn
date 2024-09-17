/* eslint-disable semi */
import express from 'express';
import { addressController } from '~/controllers/addressController';
const Router = express.Router();
//admin
Router.get('/tinh', addressController.getProvinces);
Router.get('/huyen/:provinceId', addressController.getDistricts);
Router.get('/xa/:districtId', addressController.getWards);

export const addressApi = Router;
