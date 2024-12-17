
import { GET_DB } from '~/config/mongodb';
const userStatistics = async () => {
    const db = await GET_DB();
    const collection = db.collection('users');
    const users = await collection
        .find()
        .sort({ createdAt: -1 }) // Sắp xếp theo `createdAt` giảm dần
        .limit(5) // Giới hạn 5 kết quả
        .project({
            _id: 1,
            email: 1,
            name: 1,
            role: 1,
            createdAt: 1,
        })
        .toArray();

    const totalUsers = await collection.countDocuments();
    return {
        totalUsers,
        users,
    };
}
const productsStatistics = async () => {
    const db = await GET_DB();
    const collection = db.collection('products');
    const products = await collection
        .find()
        .sort({ views: -1 }) // Sắp xếp theo `createdAt` giảm dần
        .limit(12) // Giới hạn 5 kết quả
        .project({
            _id: 1,
            name: 1,
            views: 1,
        })
        .toArray();
    return products;
}
const receiptStatistics = async () => {
    const db = await GET_DB();
    const collection = db.collection('receipt');
    const count = await collection.countDocuments();

    const receipts = await collection
        .find()
        .project({
            _id: 1,
            total: 1,
            type: 1,
        })
        .toArray();
    const storeReceipts = receipts.filter((receipt) => receipt.type === 'store');
    const totalStoreReceipts = storeReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const onlineReceipts = receipts.filter((receipt) => receipt.type === 'online');
    const totalOnlineReceipts = onlineReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const totalReceipts = totalOnlineReceipts + totalStoreReceipts;

    return {
        totalReceipts,
        receipts,
        countStoreReceipts: storeReceipts.length,
        countOnlineReceipts: onlineReceipts.length,
        totalStoreReceipts,
        totalOnlineReceipts,
        count
    };
}
const receiptFilterStatistics = async (time) => {
    const db = await GET_DB();
    const collection = db.collection('receipt');
    const receipts = await collection
        .find(
            {
                type: 'store',
                createdAt: {
                    $gte: time,
                },
            }
        )
        .toArray();
    return receipts;
}
const orderFilterStatistics = async (time) => {
    const db = await GET_DB();
    const collection = db.collection('orders');
    const receipts = await collection
        .find(
            {
                createdAt: {
                    $gte: time,
                },
            }
        )
        .toArray();
    return receipts;
}
const getOrders = async (fields, filter) => {
    const db = await GET_DB();
    const collection = db.collection('orders');
    const count = await collection.countDocuments(filter);
    const orders = await collection
        .find(filter)
        .project({
            ...fields,
        })
        .toArray();

    return {
        count,
        orders,
    };
};

const getReceipts = async (fields, filter) => {
    const db = await GET_DB();
    const collection = db.collection('receipt');
    const count = await collection.countDocuments(filter);

    const receipts = await collection
        .find(filter)
        .project({
            ...fields,
        })
        .toArray();
    return {
        count,
        receipts,
    };
}
export const dashboardModel = {
    userStatistics,
    receiptStatistics,
    productsStatistics,
    getOrders,
    getReceipts,
    receiptFilterStatistics,
    orderFilterStatistics
};
