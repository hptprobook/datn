import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_PAYMENT, UPDATE_PAYMENT } from '~/utils/schema/paymentSchema';

const validateBeforeCreate = async(data) => {
    return await SAVE_PAYMENT.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async(data) => {
    return await UPDATE_PAYMENT.validateAsync(data, { abortEarly: false });
};
const countPayment = async() => {
    const db = await GET_DB().collection('payments');
    const totail = await db.countDocuments();
    return totail;
};

const getAllPayment = async(page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('payments');
    const result = await db
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return result;
};

const getCurentPayment = async(orderId, page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;
    const db = await GET_DB().collection('payments');
    const result = await db
        .find({ orderId: new ObjectId(orderId) })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return result;
};

const createPayment = async(dataOrder) => {
    const validData = await validateBeforeCreate(dataOrder);
    const db = await GET_DB();
    const collection = db.collection('payments');
    const data = {
        ...validData,
        orderId: new ObjectId(validData.orderId),
    };
    const result = await collection.insertOne(data);
    return result;
};

const updatePayment = async(id, data) => {
    await validateBeforeUpdate(data);
    const result = await GET_DB()
        .collection('payments')
        .findOneAndUpdate({
            _id: new ObjectId(id),
        }, { $set: data }, { returnDocument: 'after' });
    return result;
};

const deletePayment = async(id) => {
    const result = await GET_DB()
        .collection('payments')
        .deleteOne({
            _id: new ObjectId(id),
        });
    return result;
};

export const paymentModel = {
    getAllPayment,
    createPayment,
    updatePayment,
    deletePayment,
    getCurentPayment,
    countPayment
};