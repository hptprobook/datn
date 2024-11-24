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
        const warehouses = await warehouseModel.getWarehousesAll();
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
const creates = async (req, res) => {
    try {
        const data = req.body;
        const errors = [];
        const successful = [];
        for (const w of data) {
            try {
                if (w._id) {
                    const existed = await warehouseModel.getWarehouseById(
                        w._id
                    );
                    if (!existed) {
                        errors.push({
                            message: `Kho với id: ${w._id} không tồn tại`,
                        });
                        continue;
                    }
                    const id = w._id;
                    delete w._id;
                    await warehouseModel.update(
                        id,
                        w
                    );
                    successful.push({
                        message: 'Cập nhật thành công kho: ' + w.name + ' với id: ' + id,
                    });
                }
                else {
                    if (!Number(w.province_id)) {
                        const province = await warehouseModel.getProvinceByName(w.province_id);
                        w.province_id = province;
                    }
                    if (w.province_id === null) {
                        errors.push({
                            message: 'Tỉnh thành không tồn tại',
                        });
                        continue;
                    }
                    if (!Number(w.district_id)) {
                        const district = await warehouseModel.getDistrictByName(w.district_id, w.province_id);
                        w.district_id = district;
                    }
                    if (w.district_id === null) {
                        errors.push({
                            message: 'Quận huyện không tồn tại',
                        });
                        continue;
                    }
                    if (!Number(w.ward_id)) {
                        const ward = await warehouseModel.getWardByName(w.ward_id, w.district_id);
                        w.ward_id = ward;
                    }
                    if (w.ward_id === null) {
                        errors.push({
                            message: 'Phường xã không tồn tại',
                        });
                        continue;
                    }
                    await warehouseModel.createWarehouse(w);
                    successful.push({
                        message: 'Tạo mới thành công kho: ' + w.name,
                    });
                }

            } catch (error) {
                errors.push({
                    message: error.details
                        ? (w.name + ': ' + error.details[0].message)
                        : (error.message || 'Có lỗi xảy ra khi thêm kho'),
                });
            }
        }

        // Trả về kết quả
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Một số kho không thể thêm được',
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
const deletes = async (req, res) => {
    try {
        const { ids } = req.body;
        const errors = [];
        const successful = [];
        for (const id of ids) {
            try {
                const existed = await warehouseModel.getWarehouseById(id);
                if (!existed) {
                    errors.push({
                        message: `Kho với id: ${id} không tồn tại`,
                    });
                    continue;
                }
                await warehouseModel.deleteWarehouse(id);
                successful.push({
                    message: 'Xóa thành công kho với id: ' + id,
                });
            } catch (error) {
                errors.push({
                    message: error.message || 'Có lỗi xảy ra khi xóa kho',
                });
            }
        }

        // Trả về kết quả
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Một số kho không thể xóa được',
                errors,
                successful,
            });
        }
        if (successful.length) {
            return res.status(StatusCodes.OK).json({
                message: 'Tất cả đã được xóa thành công',
                successful,
            });
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
    updateWareHouse,
    getWarehouseById,
    getProducts,
    creates,
    deleteWareHouse,
    deletes,
};
