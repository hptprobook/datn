/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { warehouseModel } from '~/models/warehouseModel';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';

const createWarehouse = async (req, res) => {
    try {
        const dataWarehouse = req.body;
        const result = await warehouseModel.createWarehouse(dataWarehouse);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Tạo kho hàng thành công' });
        }
        return res.status(StatusCodes.BAD_GATEWAY).json(result);
    } catch (error) {
        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const getAllWarehouses = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const warehouses = await warehouseModel.getWarehousesAll(page, limit);
        return res.status(StatusCodes.OK).json(warehouses);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

const getProducts = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const warehouses = await warehouseModel.getAllProducts(page, limit);
        return res.status(StatusCodes.OK).json(warehouses);
    } catch (error) {
        console.log(error);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

const getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const warehouse = await warehouseModel.getWarehouseById(id);
        return res.status(StatusCodes.OK).json(warehouse);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
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
        if (dataWarehouse.error) {
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
        if (dataWarehouse.error) {
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
    createWarehouse,

    getAllWarehouses,
    updateInventory,
    deleteInventory,
    getWarehouseById,

    getProducts,
};
