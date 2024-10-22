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
        const warehouses = await warehouseModel.getAllProductsByWareHouse(
            page,
            limit
        );
        return res.status(StatusCodes.OK).json(warehouses);
    } catch (error) {
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

const updateWareHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const dataWarehouse = await warehouseModel.update(id, data);
        if (dataWarehouse) {
            return res.status(StatusCodes.OK).json(dataWarehouse);
        }
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: error.message });
    }
};

const deleteWareHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await warehouseModel.deleteWarehouse(id);
        if (result.acknowledged) {
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Xóa thông tin kho thành công' });
        }
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', result });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

export const warehouseController = {
    createWarehouse,
    getAllWarehouses,
    updateWareHouse,
    getWarehouseById,
    getProducts,

    deleteWareHouse,
};
