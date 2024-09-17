/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { supplierModel } from '~/models/supplierModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';

const getAllSuppliers = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const suppliers = await supplierModel.getSuppliersAll(pages, limit);
    const countSuppliers = await supplierModel.countSupplierAll();
    return res.status(StatusCodes.OK).json({
      suppliers,
      countSuppliers,
    });
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
    if (supplier) {
      return res.status(StatusCodes.OK).json({
        supplier,
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

const createSupplier = async (req, res) => {
  const { fullName, phone, email, address } = req.body;
  if (!fullName && !phone && !email && !address) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.REQUIRED,
    });
  }

  const data = {
    fullName,
    phone,
    email,
    address,
  };
  const dataSupplier = await supplierModel.createSupplier(data);
  return res.status(StatusCodes.OK).json({ dataSupplier });
};

const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const dataSupplier = await supplierModel.update(id, data);
  if (dataSupplier?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataSupplier) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Cập nhật thông tin thành công', dataSupplier });
  }
};

const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  const dataSupplier = await supplierModel.deleteSupplier(id);
  if (dataSupplier?.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
  if (dataSupplier) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa nhà cung cấp thành công' });
  }
};

export const supplierController = {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
};
