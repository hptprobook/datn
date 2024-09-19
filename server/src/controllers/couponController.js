/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { couponModel } from '~/models/couponModel';
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
const getCoupons = async(req, res) => {
    try {
        const { limit, page } = req.query
        const coupons = await couponModel.getCoupons(page, limit);
        return res.status(StatusCodes.OK).json(coupons);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json('Có lỗi xảy ra xin thử lại sau');
    }
};
const findOneCoupons = async(req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu mã giảm giá'
            })
        }
        const coupon = await couponModel.findOneCoupons(code);
        return res.status(StatusCodes.OK).json(coupon);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
};

const createCoupon = async(req, res) => {
    try {
        const dataCoupon = req.body;
        if (dataCoupon.code) {
            const check = await couponModel.findOneCoupons(dataCoupon.code);
            if (check) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ messages: 'Mã giảm giá đã tồn tại' });
            }
        }
        const result = await couponModel.createCoupon(dataCoupon);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ messages: 'Tạo mã giảm giá thành công' });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(result);
    } catch (error) {

        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const updateCoupon = async(req, res) => {
    try {
        const { idCoupon } = req.params;
        const dataCoupon = req.body;
        const result = await couponModel.updateCoupon(idCoupon, dataCoupon);
        return res
            .status(StatusCodes.OK)
            .json(result);
    } catch (error) {
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const deleteCoupon = async(req, res) => {
    try {
        const { idCoupon } = req.params;
        const dataDel = await couponModel.deleteCoupon(idCoupon);
        if (dataDel.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ messages: 'Xoá mã giảm giá thành công' });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(dataDel);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
};

export const couponController = {
    createCoupon,
    getCoupons,
    updateCoupon,
    findOneCoupons,
    deleteCoupon,
};