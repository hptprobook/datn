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

const getOrderByCode = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { orderCode } = req.params;

    const currentOrder = await recieptModel.getOrderByCode(orderCode, user_id);

    if (!currentOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập',
      });
    }
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    return res.status(StatusCodes.OK).json(error);
  }
};

const findOrderByCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const currentOrder = await recieptModel.findOrderByCode(orderCode);
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    return res.status(StatusCodes.OK).json(error);
  }
};
const removeOrder = async (req, res) => {
  try {
    const { idOrder } = req.params;
    if (!idOrder) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin đơn hàng' });
    }
    await recieptModel.deleteOrder(idOrder);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.status) {
      const oldStatus = await recieptModel.getStatusOrder(id);
      const check = oldStatus.some((i) => data.status.status === i.status);
      if (check) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Trạng thái đơn hàng bị trùng lặp vui lòng kiểm tra lại',
        });
      }
      const newStatus = [...oldStatus, data.status];
      data.status = newStatus;
    }
    const dataOrder = await recieptModel.updateOrder(id, data);
    dataOrder.type = 'order';
    if (dataOrder) {
      await recieptModel.sendNotifies(dataOrder);
    }
    return res.status(StatusCodes.OK).json(dataOrder);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

export const receiptController = {
  getRecieptAll,
  getReceiptById,

  getOrderByCode,
  updateOrder,
  removeOrder,

  findOrderByCode,
};
