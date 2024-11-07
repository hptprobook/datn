/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { warehouseReceiptModel } from '~/models/warehouseReceiptModel';

const getAllOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const orders = await warehouseReceiptModel.getAllGoodsOrders(page, limit);
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const findBy = async (req, res) => {
  try {
    const { by, value } = req.params;
    if (by !== 'code' && by !== '_id') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Thông tin tim kiếm không hợp lệ',
      });
    }

    const orders = await warehouseReceiptModel.findBy(by, value);
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const add = async (req, res) => {
  try {
    const data = req.body;

    const staff = req.user;
    if (staff.role !== 'root' && staff.branchId !== data.warehouseId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Bạn không có quyền với kho này này',
      });
    }

    const totalQuantity = data.productsList.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    data.staffId = staff.user_id;
    await warehouseReceiptModel.checkAndUpdateCapacity(
      totalQuantity,
      data.warehouseId
    );

    const receipt = await warehouseReceiptModel.add(data);
    for (const product of data.productsList) {
      try {
        const id = await warehouseReceiptModel.updateStock(
          product.sku,
          product.size,
          product.quantity
        );
        product.status = 'Đã xác nhận';
        product._id = id.toString();
      }
      catch (error) {
        product.note = error.toString();
        product.status = 'Lỗi';
      }
    }
    const receiptUpdate = await warehouseReceiptModel.update(receipt.insertedId,
      {
        productsList: data.productsList,
        createdAt: receipt.createdAt,
      }
    );
    return res.status(StatusCodes.OK).json(receiptUpdate);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: typeof error === 'string' ? error : error.toString() });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { updateAfter } = req.query;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin hóa đơn' });
    }

    const r = await warehouseReceiptModel.getGoodsOrderById(id);
    if (!r) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Không tồn tại hóa đơn' });
    }

    if (updateAfter === 'false') {
      const result = await warehouseReceiptModel.remove(id);
      return res.status(StatusCodes.OK).json(result);
    }
    const errors = [];
    for (const product of r.productsList) {
      try {
        const currentStock = await warehouseReceiptModel.getCurrentStock(
          product._id,
          product.sku,
          product.size
        );
        const s = currentStock - product.quantity;
        product.updateStock = s;
        if (s <= 0) {
          errors.push({
            sku: product.sku,
            errors: 'Không đủ hàng trong kho',
          });
        }
      } catch (e) {
        errors.push({
          sku: product.sku,
          errors: e.toString(),
        });
      }
    }
    if (errors.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors });
    }
    const result = await warehouseReceiptModel.remove(id);
    for (const product of r.productsList) {
      await warehouseReceiptModel.updateStock(
        product.sku,
        product.size,
        product.updateStock
      );
    }
    return res
      .status(StatusCodes.OK)
      .json(result);
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
      const oldStatus = await warehouseReceiptModel.getStatusOrder(id);
      const check = oldStatus.some((i) => data.status[0].status === i.status);
      if (check) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Trạng thái hóa đơn bị trùng lặp vui lòng kiểm tra lại',
        });
      }
      const newStatus = [...oldStatus, data.status[0]];
      data.status = newStatus;
    }
    const dataOrder = await warehouseReceiptModel.update(id, data);
    return res.status(StatusCodes.OK).json(dataOrder);
  } catch (error) {
    console.log(error);

    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

export const warehouseReceiptController = {
  add,
  updateOrder,
  remove,
  getAllOrder,
  findBy,
};
