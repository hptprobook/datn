/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { recieptModel } from '~/models/receiptModel';
import { orderModel } from '~/models/orderModel';
const getRecieptAll = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const orders = await recieptModel.getAllReciept(page, limit);
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await recieptModel.getReceiptById(id);
    if (data) {
      const orderId = data.orderId;
      const dataOrder = await orderModel.getOrderById(orderId);
      const newData = { ...data, products: dataOrder.productsList };
      return res.status(StatusCodes.OK).json(newData);
    }
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getRecieptByCode = async (req, res) => {
  try {
    const { receiptCode } = req.params;
    console.log(receiptCode);

    const data = await recieptModel.getReceiptByCode(receiptCode);
    if (data) {
      const orderId = data.orderId;
      const dataOrder = await orderModel.getOrderById(orderId);
      const newData = { ...data, products: dataOrder.productsList };
      return res.status(StatusCodes.OK).json(newData);
    }
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

export const receiptController = {
  getRecieptAll,
  getReceiptById,
  getRecieptByCode,
};
