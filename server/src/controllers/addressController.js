/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { addressModel } from '~/models/addressModel';

const getWards = async(req, res) => {
    try {
        const { districtId } = req.params;
        const xas = await addressModel.getWards(districtId);
        return res.status(StatusCodes.OK).json(xas);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const getDistricts = async(req, res) => {
    try {
        const { provinceId } = req.params;
        const districts = await addressModel.getDistricts(provinceId);
        return res.status(StatusCodes.OK).json(districts);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const getProvinces = async(req, res) => {
    try {
        const tinhs = await addressModel.getProvinces();
        return res.status(StatusCodes.OK).json(tinhs);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};
export const addressController = {
    getProvinces,
    getDistricts,
    getWards,
};