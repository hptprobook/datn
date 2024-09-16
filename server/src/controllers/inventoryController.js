/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { inventoryModel } from '~/models/inventoryModel';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { uploadModal } from '~/models/uploadModel';

const createInventory = async (req, res) => {
  try {
    const { productId, userId, supplierId, vars, type, quantity } = req.body;

    if (!productId || !userId || !supplierId || !vars || !type || !quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const parsedVars = JSON.parse(vars);

    const data = {
      productId: new ObjectId(productId),
      userId: new ObjectId(userId),
      supplierId: new ObjectId(supplierId),
      vars: parsedVars,
      type,
      quantity,
    };

    const dataInventory = await inventoryModel.createInventory(data);

    return res.status(StatusCodes.OK).json({ dataInventory });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllInventories = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const inventories = await inventoryModel.getInventoriesAll(pages, limit);
    const countInventories = await inventoryModel.countInventoriesAll();
    return res.status(StatusCodes.OK).json({
      inventories,
      countInventories,
    });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await inventoryModel.getInventoryById(id);
    if (inventory) {
      return res.status(StatusCodes.OK).json({
        inventory,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại người dùng' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};
const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { productId, userId, supplierId, vars, type, quantity } = req.body;

  if (!productId || !userId || !supplierId || !vars || !type || !quantity) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const parsedVars = JSON.parse(vars);

  const data = {
    productId: new ObjectId(productId),
    userId: new ObjectId(userId),
    supplierId: new ObjectId(supplierId),
    vars: parsedVars,
    type,
    quantity,
  };

  const dataInventory = await inventoryModel.update(id, data);
  if (dataInventory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataInventory) {
    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật thông tin thành công',
      dataInventory,
    });
  }
};
const deleteInventory = async (req, res) => {
  const { id } = req.params;
  const dataInventory = await inventoryModel.deleteInventory(id);
  if (dataInventory?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataInventory) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa hàng tồn thành công' });
  }
};

export const inventoryController = {
  getAllInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryById,
};
