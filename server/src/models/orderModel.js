import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_ORDER, UPDATE_ORDER } from '~/utils/schema/orderSchema';

const validateBeforeCreate = async (data) => {
    return await SAVE_ORDER.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async (data) => {
    return await UPDATE_ORDER.validateAsync(data, { abortEarly: false });
};
// const countUserAll = async () => {
//   const db = await GET_DB().collection('carts');
//   const totail = await db.countDocuments();
//   return totail;
// };

const getAllOrders = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('orders');
    const result = await db
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .project({
            productsList: 0, // Loại bỏ trường "unnecessaryField1"
            note: 0, // Loại bỏ trường "unnecessaryField2"
        })
        // .project({ _id: 0, age:1 })
        .toArray();
    return result;
};
const getOrderById = async (id) => {
    const db = await GET_DB().collection('orders');
    const result = await db.findOne({
        _id: new ObjectId(id),
    });
    if (!result) {
        throw new Error('Đơn hàng không tồn tại');
    }
    return result;
};


const getCurentOrder = async (user_id, page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;
    const db = await GET_DB().collection('orders');
    const result = await db
        .find({ userId: new ObjectId(user_id) })
        .skip((page - 1) * limit)
        .limit(limit)
        // .project({ products: 1, userId: 0, _id: 0 })
        .toArray();
    return result;
};

const addOrder = async (dataOrder) => {
    const validData = await validateBeforeCreate(dataOrder);
    const db = await GET_DB();
    const collection = db.collection('orders');
    const data = {
        ...validData,
        userId: new ObjectId(validData.userId),
        productsList: validData.productsList.map((item) => {
            return {
                ...item,
                _id: new ObjectId(item._id),
            };
        }),
    };
    const result = await collection.insertOne(data);
    return result;
};

const findCartById = async (user_id) => {
    const db = await GET_DB().collection('carts');
    const result = await db.findOne({
        userId: new ObjectId(user_id),
    });
    return result;
};

const updateOrder = async (id, data) => {
    await validateBeforeUpdate(data);
    const result = await GET_DB()
        .collection('orders')
        .findOneAndUpdate({
            _id: new ObjectId(id),
        }, { $set: data }, { returnDocument: 'after' });
    return result;
};

const deleteOrder = async (id) => {
    const result = await GET_DB()
        .collection('orders')
        .deleteOne({
            _id: new ObjectId(id),
        });
    return result;
};

const checkStockProducts = async (data) => {
    const db = await GET_DB().collection('products');
    const result = await db
        .find({
            _id: new ObjectId(data._id),
            vars: {
                $elemMatch: {
                    color: data.vars.color,
                    size: data.vars.size,
                },
            },
        })
        .project({ _id: 0, 'vars.$': 1 })
        .toArray();
    return result;
};

const updateStockProducts = async () => {
    const productId = '669bb95902b3201abc75dad6';
    const updates = [
        { color: 'red', size: 'S', stockChange: -1 },
        { color: 'red', size: 'M', stockChange: -2 },
        // Thêm các điều kiện khác tại đây
    ];

    const db = await GET_DB().collection('products');
    for (const update of updates) {
        await db.updateOne({
            _id: new ObjectId(productId),
            vars: {
                $elemMatch: {
                    color: update.color,
                    size: update.size,
                },
            },
        }, { $inc: { 'vars.$.stock': update.stockChange } });
    }
};

export const orderModel = {
    getAllOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getCurentOrder,
    findCartById,
    checkStockProducts,
    updateStockProducts,
    getOrderById,
};