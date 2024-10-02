/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { supplierModel } from '~/models/supplierModel';
import { StatusCodes } from 'http-status-codes';

const getAllSuppliers = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const suppliers = await supplierModel.getSuppliersAll(pages, limit);
    return res.status(StatusCodes.OK).json(suppliers);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await supplierModel.getSupplierById(id);
    if (!supplier) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy nhà cung cấp!' });
    }
    return res.status(StatusCodes.OK).json(supplier);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const createSupplier = async (req, res) => {
  try {
    const data = req.body;
    const dataSupplier = await supplierModel.createSupplier(data);
    return res.status(StatusCodes.CREATED).json(dataSupplier);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const supplier = await supplierModel.update(id, data);
    if (!supplier) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy nhà cung cấp!' });
    }
    return res.status(StatusCodes.OK).json(supplier);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await supplierModel.deleteSupplier(id);
    return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteAllSupplier = async (req, res) => {
  try {
    await supplierModel.deleteAllSuppliers();
    return res.status(StatusCodes.OK).json({ message: 'Xóa thành công' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const supplierController = {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  deleteAllSupplier,
};
