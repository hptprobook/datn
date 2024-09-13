/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { brandModel } from '~/models/brandModel';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { createSlug } from '~/utils/createSlug';

const createBrand = async (req, res) => {
  try {
    const { name, content, status } = req.body;

    if (!name || !content || !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }
    const file = req.file;
    const fileName = file ? file.filename : '';
    const slug = createSlug(name);

    const data = {
      name,
      slug,
      image: fileName,
      content,
      status,
    };

    const dataBrand = await brandModel.createInventory(data);

    return res.status(StatusCodes.OK).json({ dataBrand });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const brands = await brandModel.getBrandsAll(pages, limit);
    const count = await brandModel.countBrandsAll();
    return res.status(StatusCodes.OK).json({
      brands,
      count,
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
    const inventory = await brandModel.getInventoryById(id);
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

  const dataInventory = await brandModel.update(id, data);
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
  const dataInventory = await brandModel.deleteInventory(id);
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

export const brandController = {
  getAllBrands,
  createBrand,
  updateInventory,
  deleteInventory,
  getInventoryById,
};
