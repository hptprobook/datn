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
const receiptFilterStatistics = async (req, res) => {
    try {
        const now = Date.now(); // Lấy thời gian hiện tại (timestamp)
        const startOfToday = new Date(now).setHours(0, 0, 0, 0); // Đặt mốc bắt đầu từ 0h
        const startOfDay = new Date(now).setHours(0, 0, 0, 0);
        const endOfDay = new Date(now).setHours(23, 59, 59, 999);
        const receipts = await dashboardModel.receiptFilterStatistics(startOfToday);
        const orders = await dashboardModel.orderFilterStatistics(startOfToday);
        const ranges = {
            '00:00 - 08:00': { start: startOfDay, end: new Date(now).setHours(8, 0, 0, 0) },
            '08:00 - 12:00': { start: new Date(now).setHours(8, 0, 0, 0), end: new Date(now).setHours(12, 0, 0, 0) },
            '12:00 - 16:00': { start: new Date(now).setHours(12, 0, 0, 0), end: new Date(now).setHours(16, 0, 0, 0) },
            '16:00 - 23:59': { start: new Date(now).setHours(16, 0, 0, 0), end: endOfDay },
        };

        // Đếm số lượng hóa đơn cho từng nhóm giờ
        const result = {
            '00:00 - 08:00': 0,
            '08:00 - 12:00': 0,
            '12:00 - 16:00': 0,
            '16:00 - 23:59': 0,
        };
        const resultOrder = {
            '00:00 - 08:00': 0,
            '08:00 - 12:00': 0,
            '12:00 - 16:00': 0,
            '16:00 - 23:59': 0,
        };
        const totalOrder = {
            '00:00 - 08:00': 0,
            '08:00 - 12:00': 0,
            '12:00 - 16:00': 0,
            '16:00 - 23:59': 0,
        };
        const totalReceipt = {
            '00:00 - 08:00': 0,
            '08:00 - 12:00': 0,
            '12:00 - 16:00': 0,
            '16:00 - 23:59': 0,
        }

        receipts.forEach((receipt) => {
            if (receipt.createdAt >= startOfDay && receipt.createdAt <= endOfDay) {
                for (const range in ranges) {
                    const { start, end } = ranges[range];
                    if (receipt.createdAt >= start && receipt.createdAt < end) {
                        result[range]++;
                        totalReceipt[range] += receipt.total;
                        break;
                    }
                }
            }
        });
        orders.forEach((order) => {
            if (order.createdAt >= startOfDay && order.createdAt <= endOfDay) {
                for (const range in ranges) {
                    const { start, end } = ranges[range];
                    if (order.createdAt >= start && order.createdAt < end) {
                        resultOrder[range]++;
                        totalOrder[range] += order.totalPayment;
                        break;
                    }
                }
            }
        });
        const labels = Object.keys(result); // Mảng label
        const results = Object.values(result); // Mảng kết quả
        const resultsOrder = Object.values(resultOrder); // Mảng kết quả
        const totalReciept = Object.values(totalReceipt); // Mảng kết quả
        const totalOrderPayment = Object.values(totalOrder); // Mảng kết quả
        const count = receipts.length; // Tổng số hóa đơn

        const revenue = receipts.reduce((sum, receipt) => sum + receipt.total, 0); // Tổng doanh thu
        const revenueOrder = orders.reduce((sum, order) => sum + order.totalPayment, 0); // Tổng doanh thu
        const dataChart = {
            labels,
            results,
            resultsOrder,
            totalReciept,
            totalOrderPayment
        };
        return res.status(StatusCodes.OK).json({
            dataChart,
            count,
            revenue,
            revenueOrder,
            countOrder: orders.length
        });
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
    orders7DayStatistics,
    receiptFilterStatistics
};