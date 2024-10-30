import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_RECEIPT_SCHEMA,
  UPDATE_RECEIPT_SCHEMA,
} from '~/utils/schema/receiptSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_RECEIPT_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_RECEIPT_SCHEMA.validateAsync(data, { abortEarly: false });
};
const getAllReciept = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('receipt');
  const result = await db
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    // .project({
    //   productsList: 0, // Loại bỏ trường "unnecessaryField1"
    //   note: 0, // Loại bỏ trường "unnecessaryField2"
    // })
    .toArray();
  return result;
};
const getReceiptById = async (id) => {
  const db = await GET_DB().collection('receipt');
  const result = await db.findOne({
    _id: new ObjectId(id),
  });
  return result;
};

const addReceipt = async (dataReciept) => {
  const validData = await validateBeforeCreate(dataReciept);
  const db = await GET_DB();
  const collection = db.collection('receipt');
  const data = {
    ...validData,
    orderId: new ObjectId(validData.orderId),
  };
  const result = await collection.insertOne(data);
  return result;
};

const getReceiptByCode = async (receiptCode) => {
  const db = await GET_DB().collection('receipt');
  const result = await db.findOne({
    receiptCode: receiptCode,
  });
  return result;
};

const updateReceipt = async (orderId, data) => {
  const validatedData = await validateBeforeUpdate(data);
  const result = await GET_DB()
    .collection('receipt')
    .findOneAndUpdate(
      {
        orderId: new ObjectId(orderId),
      },
      { $set: validatedData },
      { returnDocument: 'after' }
    );
  return result;
};

const deleteReceipt = async (orderId) => {
  const result = await GET_DB()
    .collection('receipt')
    .deleteOne({
      orderId: new ObjectId(orderId),
    });
  return result;
};

export const recieptModel = {
  addReceipt,
  getAllReciept,
  getReceiptById,
  getReceiptByCode,
  updateReceipt,
  deleteReceipt,
};
