/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { recieptModel } from '~/models/receiptModel';
import { orderModel } from '~/models/orderModel';


const addReceipt = async (req, res) => {
  try {
    const { user_id } = req.user;
    const dataReceipt = {
      ...req.body,
      staffId: user_id,
    };
    const result = await recieptModel.addReceipt(dataReceipt);
    const ReceiptData = await recieptModel.getReceiptById(
      result.insertedId.toString()
    );
    // trừ số lượng
    const newData = ReceiptData.productsList
      .filter(item => item.sku !== null)
      .map(item => ({
        productId: item._id.toString(),
        name: item.name,
        variantColor: item.variantColor,
        variantSize: item.variantSize,
        quantity: -item.quantity,
      }));

    const results = await Promise.all(
      newData.map(async (item) => {
        const updateResult = await orderModel.updateSingleProductStock(item);
        if (updateResult.modifiedCount === 0) {
          return {
            productId: item.productId,
            message: `${item.name} không đủ tồn kho hoặc không tìm thấy sản phẩm.`,
          };
        }
        return null;
      })
    );
    const failedUpdates = results.filter((result) => result !== null);
    if (failedUpdates.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(failedUpdates);
    }
    return res.status(StatusCodes.OK).json({
      message: 'Tạo hóa đơn thành công',
      data: ReceiptData,
      message2: 'Cập nhật tồn kho thành công.',
    });
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateReceipt = async (req, res) => {
  // trực tiếp tại cửa hàng
  try {
    const { id } = req.params;
    const dataReceipt = req.body;
    if (dataReceipt.status && dataReceipt.status == 'returned') {
      const getStatus = await recieptModel.getReceiptById(id);
      //   hóa đơn đã hủy
      if (getStatus.status == 'returned') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'không thể cập nhật trạng thái hóa đơn đã hoàn trả',
        });
      }

      //   Hủy hóa đơn
      const result = await recieptModel.updateReceipt(id, dataReceipt);
      const newData = result.productsList.map((item) => {
        return {
          productId: item._id.toString(),
          name: item.name,
          variantColor: item.variantColor,
          variantSize: item.variantSize,
          quantity: item.quantity,
        };
      });
      await Promise.all(
        newData.map(async (item) => {
          await orderModel.updateSingleProductStock(item);
        })
      );
      return res.status(StatusCodes.OK).json({
        message: 'Hủy hóa đơn thành công',
        data: result,
      });
    }
    const result = await recieptModel.updateReceipt(id, dataReceipt);
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật hóa đơn thành công',
      data: result,
    });
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

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
    const data = await recieptModel.getReceiptByCode(receiptCode);
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const delReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const getStatus = await recieptModel.getReceiptById(id);
    if (getStatus.status == 'returned') {
      await recieptModel.deleteReceipt(id);
      return res.status(StatusCodes.OK).json({
        message: 'Xóa hóa đơn thành công',
      });
    }
    if (getStatus.orderId) {
      await recieptModel.deleteReceipt(id);
      return res.status(StatusCodes.OK).json({
        message: 'Xóa hóa đơn thành công',
      });
    }
    const newData = getStatus.productsList.map((item) => {
      return {
        productId: item._id.toString(),
        name: item.name,
        variantColor: item.variantColor,
        variantSize: item.variantSize,
        quantity: item.quantity,
      };
    });
    await Promise.all(
      newData.map(async (item) => {
        await orderModel.updateSingleProductStock(item);
      })
    );
    await recieptModel.deleteReceipt(id);
    return res.status(StatusCodes.OK).json({
      message: 'Xóa hóa đơn thành công',
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

export const receiptController = {
  addReceipt,
  getRecieptAll,
  getReceiptById,
  getRecieptByCode,
  updateReceipt,
  delReceipt,
};
