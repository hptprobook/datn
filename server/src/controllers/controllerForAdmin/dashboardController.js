import { StatusCodes } from 'http-status-codes';
import { dashboardModel } from '~/models/dashboardModel';
const userStatistics = async (req, res) => {
    try {
        const results = await dashboardModel.userStatistics();
        return res.status(StatusCodes.OK).json(results);
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}
const receiptStatistics = async (req, res) => {
    try {
        const results = await dashboardModel.receiptStatistics();
        return res.status(StatusCodes.OK).json(results);
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}
const productsStatistics = async (req, res) => {
    try {
        const results = await dashboardModel.productsStatistics();
        return res.status(StatusCodes.OK).json(results);
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}
const orders7DayStatistics = async (req, res) => {
    try {
        let filter = {};
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        filter.createdAt = { $gte: sevenDaysAgo };
        const orders = await dashboardModel.getOrders({
            _id: 1,
            createdAt: 1,
        }, filter);
        const receipts = await dashboardModel.getReceipts({
            _id: 1,
            type: 1,
            createdAt: 1,
        }, filter
        );
        const daysArray = [];
        const ordersCountArray = [];
        const ordersByDay = {};
        const receiptsOnlineByDay = {};
        const receiptsOnlineArray = [];
        const receiptsStoreByDay = {};
        const receiptsStoreArray = [];
        orders.orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];

            if (!ordersByDay[date]) {
                ordersByDay[date] = 0;
            }

            ordersByDay[date]++;
        });
        receipts.receipts.forEach(receipt => {
            const date = new Date(receipt.createdAt).toISOString().split('T')[0];
            if (!receiptsOnlineByDay[date]) {
                receiptsOnlineByDay[date] = 0;
            }
            if (!receiptsStoreByDay[date]) {
                receiptsStoreByDay[date] = 0;
            }
            if (receipt.type === 'online') {
                receiptsOnlineByDay[date]++;
            }
            else {
                receiptsStoreByDay[date]++;
            }
        }
        );

        for (let i = 0; i < 7; i++) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            daysArray.push(date);
            ordersCountArray.push(ordersByDay[date] || 0);
            receiptsOnlineArray.push(receiptsOnlineByDay[date] || 0);
            receiptsStoreArray.push(receiptsStoreByDay[date] || 0);
        }
        return res.status(StatusCodes.OK).json({
            daysArray,
            ordersCountArray,
            receiptsOnlineArray,
            receiptsStoreArray,
            countOrders: orders.count,
            countReceipts: receipts.count,
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        });
    }
}

export const dashboardController = {
    userStatistics,
    receiptStatistics,
    productsStatistics,
    orders7DayStatistics
};