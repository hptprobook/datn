/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { warehouseModel } from '~/models/warehouseModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';

const createWarehouse = async (req, res) => {
  try {
    const { name, status, location, capacity, currentInventory } = req.body;

    if (!name || !status || !location || !capacity || !currentInventory) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const data = {
      name,
      status,
      location,
      capacity,
      currentInventory,
    };

    const dataWarehouse = await warehouseModel.createWarehouse(data);

    return res.status(StatusCodes.OK).json({ dataWarehouse });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await warehouseModel.getWarehousesAll();
    return res.status(StatusCodes.OK).json(warehouses);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await warehouseModel.getWarehouseById(id);
    if (warehouse) {
      return res.status(StatusCodes.OK).json(warehouse);
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại nhà kho' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getWarehouseByName = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const { name } = req.params;

    const warehouse = await warehouseModel.getWarehouseByName(
      name,
      pages,
      limit
    );
    if (warehouse) {
      return res.status(StatusCodes.OK).json({
        warehouse,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại nhà kho' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, location, capacity, currentInventory } = req.body;

    if (!name || !status || !location || !capacity || !currentInventory) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }

    const data = {
      name,
      status,
      location,
      capacity,
      currentInventory,
    };

    const dataWarehouse = await warehouseModel.update(id, data);
    if (dataWarehouse?.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
    if (dataWarehouse) {
      return res.status(StatusCodes.OK).json(dataWarehouse);
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const dataWarehouse = await warehouseModel.deleteWarehouse(id);
    if (dataWarehouse?.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
    if (dataWarehouse) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xóa nhà kho thành công' });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const warehouseController = {
  getAllWarehouses,
  createWarehouse,
  updateInventory,
  deleteInventory,
  getWarehouseById,
  getWarehouseByName,
};
