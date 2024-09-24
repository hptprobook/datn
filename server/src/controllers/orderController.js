/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';

const getAllOrder = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const orders = await orderModel.getAllOrders(page, limit);
        return res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error,
        });
    }
};

const getCurrentOrder = async (req, res) => {
    try {
        const { user_id } = req.user;
        const currentOrder = await orderModel.getCurrentOrder(user_id);
        return res.status(StatusCodes.OK).json(currentOrder);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error,
        });
    }
};
const addOrder = async (req, res) => {
    try {
        const { user_id } = req.user;
        const dataOrder = { userId: user_id, ...req.body };
        await orderModel.addOrder(dataOrder);
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Bạn đã đặt hàng thành công' });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
    }
};

const removeOrder = async (req, res) => {
    try {
        const { idOrder } = req.params;
        if (!idOrder) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Thiếu thông tin đơn hàng' });
        }
        await orderModel.deleteOrder(idOrder);
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Xóa đơn hàng thành công' });
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
            const oldStatus = await orderModel.getStatusOrder(id);
            const newStatus = [...oldStatus, data.status];
            data.status = newStatus;
        }
        const dataOrder = await orderModel.updateOrder(id, data);
        return res.status(StatusCodes.OK).json(dataOrder);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Có lỗi xảy ra xin thử lại sau',
            error: error,
        });
    }
};
const checkStockProducts = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Hãy gửi 1 mảng sản phẩm' });
        }

        if (req.body.length === 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Thiếu thông tin sản phẩm' });
        }
        // Kiểm tra thông tin sản phẩm
        for (let { _id, quantity, vars } of req.body) {
            if (!_id || !vars.color || !vars.size || !quantity) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: 'Thiếu thông tin của sản phẩm' });
            }
        }
        let a = false;
        const checkPromises = req.body.map(async (item) => {
            const product = await orderModel.checkStockProducts(item);
            if (product.length > 0) {
                const quantityProduct = product[0].vars[0].stock;
                if (quantityProduct < item.quantity) {
                    a = true;
                    return {
                        id: item._id,
                        message: `Không đủ số lượng còn: ${quantityProduct}`,
                    };
                }
            } else {
                a = true;
                return {
                    id: item._id,
                    message: 'Không có sản phẩm',
                };
            }
        });

        const results = await Promise.all(checkPromises);
        const filteredResults = results.filter((n) => n);
        if (a) {
            return res.status(StatusCodes.BAD_REQUEST).json(filteredResults);
        }
        return res.status(StatusCodes.OK).json({ message: 'Có thể mua hàng' });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error,
        });
    }
};

const updateStockProducts = async (req, res) => {
    try {
        await orderModel.updateStockProducts();
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Cập nhật số lượng sản phẩm' });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error,
        });
    }
};

export const orderController = {
    checkStockProducts,
    addOrder,
    getCurrentOrder,
    updateOrder,
    removeOrder,
    getAllOrder,
    updateStockProducts,
    getOrderById,
};
