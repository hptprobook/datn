/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { supplierModel } from '~/models/supplierModel';
import { StatusCodes } from 'http-status-codes';

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.getSuppliersAll();
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

const deleteManySupplier = async (req, res) => {
  try {
    const { ids } = req.body;

    await supplierModel.deleteManySuppliers(ids);

    return res.status(StatusCodes.OK).json({
      message: 'Xóa thành công',
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
const createManySuppliers = async (req, res) => {
  try {
    const data = req.body;
    const errors = [];
    const successful = [];
    for (const w of data) {
      try {
        if (w._id) {
          const existed = await supplierModel.getSupplierById(
            w._id
          );
          if (!existed) {
            errors.push({
              message: `Nhãn hàng với id: ${w._id} không tồn tại`,
            });
            continue;
          }
          else if (existed.registrationNumber == w.registrationNumber && w._id != existed._id) {
            errors.push({
              message: `Mã số thuế ${w.registrationNumber} đã tồn tại`,
            });
            continue;
          }
          const id = w._id;
          delete w._id;
          await supplierModel.update(
            id,
            w
          );
          successful.push({
            message: 'Cập nhật thành công nhà cung cấp: ' + w.fullName + ' với id: ' + id,
          });
        }
        else {
          const existed = await supplierModel.getOneBy('registrationNumber', w.registrationNumber);
          if (existed) {
            errors.push({
              message: `Slug ${w.registrationNumber} đã tồn tại`,
            });
            continue;
          }
          await supplierModel.createSupplier(w);
          successful.push({
            message: 'Tạo mới thành công nhà cung cấp: ' + w.fullName,
          });
        }

      } catch (error) {
        errors.push({
          message: error.details
            ? `${w.fullName}: ${error.details[0].message}`
            : (error.message || 'Có lỗi xảy ra khi thêm nhà cung cấp'),
        });
      }
    }

    // Trả về kết quả
    if (errors.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Một số nhà cung cấp không thể thêm được',
        errors,
        successful,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: 'Tất cả đã được thêm thành công',
      successful,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
    });
  }
};
export const supplierController = {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  deleteAllSupplier,
  deleteManySupplier,
  createManySuppliers
};
