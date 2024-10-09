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
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message:
                    'Hãy gửi thông tin sản phẩm đúng định dạng và không được bỏ trống.',
            });
        }

        for (const {
            productId,
            variantColor,
            variantSize,
            name,
            quantity,
        } of products) {
            if (
                !productId ||
                !name ||
                !variantColor ||
                !variantSize ||
                !quantity
            ) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Thiếu thông tin của sản phẩm',
                });
            }
        }

        const results = await Promise.all(
            products.map(async (item) => {
                const product = await orderModel.checkStockProducts(item);

                if (!product.length) {
                    return {
                        id: item.productId,
                        message: `${item.name} đã ngưng bán hoặc có lỗi xảy ra`,
                    };
                }
                const quantityProduct = product[0].variants[0].sizes[0].stock;
                if (quantityProduct < item.quantity) {
                    return {
                        id: item.productId,
                        message: `${item.name} số lượng còn lại: ${quantityProduct}`,
                    };
                }

                return null;
            })
        );
        const filteredResults = results.filter((result) => result);
        if (filteredResults.length > 0) {
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
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message:
                    'Hãy gửi thông tin sản phẩm đúng định dạng và không được bỏ trống.',
            });
        }

        for (const {
            productId,
            variantColor,
            variantSize,
            name,
            quantity,
        } of products) {
            if (
                !productId ||
                !name ||
                !variantColor ||
                !variantSize ||
                !quantity
            ) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Thiếu thông tin của sản phẩm',
                });
            }
        }
        const results = await Promise.all(
            products.map(async (item) => {
                const updateResult = await orderModel.updateSingleProductStock(
                    item
                );
                if (updateResult.modifiedCount === 0) {
                    return {
                        productId: item.productId,
                        message: `${item.name} không đủ tồn kho hoặc không tìm thấy sản phẩm.`,
                    };
                }
                return null;
            })
        );
        const failedUpdates = results.filter((result) => result !== null);

        if (failedUpdates.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json(failedUpdates);
        }

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật tồn kho thành công.',
        });
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
