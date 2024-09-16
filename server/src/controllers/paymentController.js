/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { paymentModel } from '~/models/paymentModel';
const getAllPayment = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const orders = await paymentModel.getAllPayment(page, limit);
        const count = await paymentModel.countPayment()
        return res.status(StatusCodes.OK).json({ orders, count });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error,
        });
    }
};

const getCurentPayment = async(req, res) => {
    try {
        const { orderId } = req.params
        const curentPayment = await paymentModel.getCurentPayment(orderId);
        return res.status(StatusCodes.OK).json(curentPayment);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};
const createPayment = async(req, res) => {
    try {
        const dataPayment = req.body
        const result = await paymentModel.createPayment(dataPayment);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Lưu thanh toán thành công' });
        }
        return res
            .status(StatusCodes.BAD_GATEWAY)
            .json({ message: 'Lỗi thanh toán', result });
    } catch (error) {
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const removePayment = async(req, res) => {
    try {
        const { idPayment } = req.params;
        if (!idPayment) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Thiếu thông tin đơn hàng' });
        }
        await paymentModel.deletePayment(idPayment);
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

const updatePayment = async(req, res) => {
    try {
        const { idPayment } = req.params;
        const data = req.body;
        const dataPayment = await paymentModel.updatePayment(idPayment, data);
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Cập nhật thông tin thành công', dataPayment });
    } catch (error) {


        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};


export const paymentController = {
    createPayment,
    getCurentPayment,
    updatePayment,
    removePayment,
    getAllPayment,
};