import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_ORDER } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_ORDER.validateAsync(data, { abortEarly: false });
};
// const validateBeforeUpdate = async (data) => {
//   return await UPDATE_CARTS.validateAsync(data, { abortEarly: false });
// };
// const countUserAll = async () => {
//   const db = await GET_DB().collection('carts');
//   const totail = await db.countDocuments();
//   return totail;
// };

const getAllOrders = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 2;
  const db = await GET_DB().collection('orders');
  const result = await db
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    // .project({ _id: 0, age:1 })
    .toArray();
  return result;
};

const getCurentCarts = async (user_id) => {
  const db = await GET_DB().collection('carts');
  const result = await db.findOne({ userId: new ObjectId(user_id) });
  // .project({ products: 1, userId: 0, _id: 0 })
  // .toArray();
  return result;
};

const addOrder = async (dataOrder) => {
  const validData = await validateBeforeCreate(dataOrder);
  const db = await GET_DB();
  const collection = db.collection('orders');
  const data = {
    ...validData,
    userId: new ObjectId(validData.userId),
    products: [
      validData.products.map((item) => {
        return {
          ...item,
          _id: new ObjectId(item._id),
        };
      }),
    ],
  };
  const result = await collection.insertOne(data);
  return result;
};

const addNewCart = async (userId, datas) => {
  const validData = await validateBeforeAdd(datas);
  const data = {
    ...validData,
    _id: new ObjectId(validData._id),
  };
  const db = await GET_DB();
  const collection = db.collection('carts');
  const result = await collection.findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $push: { products: data } }
  );
  return result;
};
const findCartById = async (user_id) => {
  const db = await GET_DB().collection('carts');
  const result = await db.findOne({
    userId: new ObjectId(user_id),
  });
  return result;
};
const findCart = async (user_id, color, size) => {
  const db = await GET_DB().collection('carts');
  const result = await db.findOne({
    userId: new ObjectId(user_id),
    'products.vars.color': color,
    'products.vars.size': size,
  });
  return result;
};

const updateCart = async (id, data) => {
  const result = await GET_DB()
    .collection('carts')
    .findOneAndUpdate(
      {
        userId: new ObjectId(id),
        'products._id': new ObjectId(data._id),
        'products.vars.color': data.vars.color,
        'products.vars.size': data.vars.size,
      },
      { $set: { 'products.$.quantity': data.quantity, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    );
  return result;
};
const addQuantityCart = async (id, data) => {
  const validData = await validateBeforeUpdateQuantity(data);
  const result = await GET_DB()
    .collection('carts')
    .findOneAndUpdate(
      {
        userId: new ObjectId(id),
        'products._id': new ObjectId(validData._id), // Bỏ khoảng trắng thừa
        'products.vars.color': validData.vars.color,
        'products.vars.size': validData.vars.size,
      },
      { $inc: { 'products.$.quantity': validData.quantity } },
      { returnDocument: 'after' }
    );
  return result;
};
const removeCart = async (id, data) => {
  const result = await GET_DB()
    .collection('carts')
    .updateOne(
      { userId: new ObjectId(id) },
      {
        $pull: {
          products: {
            _id: new ObjectId(data._id),
            'vars.color': data.vars.color,
            'vars.size': data.vars.size,
          },
        },
      },
      { multi: true }
    );
  return result;
};

const deleteCart = async (userId) => {
  const result = await GET_DB()
    .collection('carts')
    .deleteOne({
      userId: new ObjectId(userId),
    });
  return result;
};

export const orderModel = {
  getAllOrders,
  addOrder,
  findCart,
  updateCart,
  deleteCart,
  getCurentCarts,
  addNewCart,
  findCartById,
  addQuantityCart,
  removeCart,
};
