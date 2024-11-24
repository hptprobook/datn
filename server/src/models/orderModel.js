import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_ORDER,
  UPDATE_ORDER,
  SAVE_ORDER_NOT_LOGIN,
} from '~/utils/schema/orderSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_ORDER.validateAsync(data, { abortEarly: false });
};
const validateBeforeCreateNot = async (data) => {
  return await SAVE_ORDER_NOT_LOGIN.validateAsync(data, {
    abortEarly: false,
  });
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
  const total = await db.countDocuments();
  const result = await db
    .find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .project({
      productsList: 0, // Loại bỏ trường "unnecessaryField1"
      note: 0, // Loại bỏ trường "unnecessaryField2"
    })
    // .project({ _id: 0, age:1 })
    .toArray();
  return { total, result };
};

const searchCurrentOrder = async (userId, keyword, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;

  const db = await GET_DB().collection('orders');

  // Xây dựng query tìm kiếm
  const query = {
    userId: new ObjectId(userId),
    $or: [
      { orderCode: { $regex: keyword, $options: 'i' } }, // Tìm theo orderCode
      { 'productsList.name': { $regex: keyword, $options: 'i' } }, // Tìm theo tên sản phẩm
    ],
  };

  const total = await db.countDocuments(query);
  const result = await db
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return { total, result };
};

const getOrderById = async (id) => {
  const db = await GET_DB().collection('orders');
  const result = await db.findOne({
    _id: new ObjectId(id),
  });
  return result;
};

const getOrderByCode = async (orderCode, userId) => {
  const db = await GET_DB().collection('orders');
  const result = await db.findOne({
    orderCode: orderCode,
    userId: new ObjectId(userId),
  });
  return result;
};

const getCurrentOrder = async (user_id, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('orders');
  const total = await db.countDocuments({ userId: new ObjectId(user_id) });
  const result = await db
    .find({ userId: new ObjectId(user_id) })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return { total, result };
};

const getCurrentOrderByStatus = async (user_id, status, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('orders');
  const countResult = await db
    .aggregate([
      { $match: { userId: new ObjectId(user_id) } },
      {
        $addFields: {
          latestStatus: { $arrayElemAt: [{ $slice: ['$status', -1] }, 0] },
        },
      },
      { $match: { 'latestStatus.status': status } },
      { $count: 'total' },
    ])
    .toArray();
  const total = countResult.length > 0 ? countResult[0].total : 0;
  const result = await db
    .aggregate([
      { $match: { userId: new ObjectId(user_id) } },
      {
        $addFields: {
          latestStatus: { $arrayElemAt: [{ $slice: ['$status', -1] }, 0] },
        },
      },
      { $match: { 'latestStatus.status': status } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ])
    .project({ latestStatus: 0 })
    .toArray();
  return { total, result };
};
const getOrderByStatus = async (status, page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('orders');
  const countResult = await db
    .aggregate([
      {
        $addFields: {
          latestStatus: { $arrayElemAt: [{ $slice: ['$status', -1] }, 0] },
        },
      },
      { $match: { 'latestStatus.status': status } },
      { $count: 'total' },
    ])
    .toArray();
  const total = countResult.length > 0 ? countResult[0].total : 0;
  const result = await db
    .aggregate([
      {
        $addFields: {
          latestStatus: { $arrayElemAt: [{ $slice: ['$status', -1] }, 0] },
        },
      },
      { $match: { 'latestStatus.status': status } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ])
    .project({ latestStatus: 0 })
    .toArray();
  return { total, result };
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

const addOrderNotLogin = async (dataOrder) => {
  const validData = await validateBeforeCreateNot(dataOrder);
  const db = await GET_DB();
  const collection = db.collection('orders');
  const data = {
    ...validData,
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

const findOrderByCode = async (orderCode) => {
  const db = await GET_DB().collection('orders');
  const result = await db.findOne({
    orderCode: orderCode,
  });
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
  const validatedData = await validateBeforeUpdate(data);
  const result = await GET_DB()
    .collection('orders')
    .findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: validatedData },
      { returnDocument: 'after' }
    );
  return result;
};

const getStatusOrder = async (id) => {
  const db = await GET_DB().collection('orders');
  const result = await db.findOne(
    { _id: new ObjectId(id) },
    { projection: { status: 1 } } // Use projection to return only the 'status' field
  );
  return result ? result.status : null; // Return only the 'status' value
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
      _id: new ObjectId(data.productId),
      variants: {
        $elemMatch: {
          color: data.variantColor,
          'sizes.size': data.variantSize,
        },
      },
    })
    .project({
      _id: 0,
      name: 1,
      'variants.$': 1,
    })
    .toArray();

  if (result.length > 0 && result[0].variants.length > 0) {
    const filteredSizes = result[0].variants[0].sizes.filter(
      (size) => size.size === data.variantSize
    );
    result[0].variants[0].sizes = filteredSizes;
  }
  return result;
};

const updateSingleProductStock = async (data) => {
  const db = await GET_DB().collection('products');
  const result = await db.updateOne(
    {
      _id: new ObjectId(data.productId),
      'variants.color': data.variantColor,
      'variants.sizes.size': data.variantSize,
    },
    {
      $inc: {
        'variants.$.stock': data.quantity,
        'variants.$.sizes.$[size].stock': data.quantity,
        'variants.$.sizes.$[size].sale': data.quantity,
      },
    },
    {
      arrayFilters: [{ 'size.size': data.variantSize }],
    }
  );
  return result;
};

const updateConfirmedStock = async (data) => {
  const db = await GET_DB().collection('products');
  const result = await db.updateOne(
    {
      _id: new ObjectId(data.productId),
      'variants.color': data.variantColor,
      'variants.sizes.size': data.variantSize,
    },
    {
      $inc: {
        'variants.$.sizes.$[size].sale': -data.quantity,
        'variants.$.sizes.$[size].trading': data.quantity,
      },
    },
    {
      arrayFilters: [{ 'size.size': data.variantSize }],
    }
  );
  return result;
};

const updateCompletedStock = async (data) => {
  const db = await GET_DB().collection('products');
  const result = await db.updateOne(
    {
      _id: new ObjectId(data.productId),
      'variants.color': data.variantColor,
      'variants.sizes.size': data.variantSize,
    },
    {
      $inc: {
        'variants.$.stock': -data.quantity,
        'variants.$.sizes.$[size].stock': -data.quantity,
        'variants.$.sizes.$[size].trading': -data.quantity,
      },
    },
    {
      arrayFilters: [{ 'size.size': data.variantSize }],
    }
  );
  return result;
};

export const orderModel = {
  getAllOrders,
  addOrder,
  searchCurrentOrder,
  updateOrder,
  deleteOrder,
  getCurrentOrder,
  getOrderByCode,
  findCartById,
  checkStockProducts,
  updateSingleProductStock,
  getCurrentOrderByStatus,
  getOrderByStatus,
  // updateStockProducts,
  addOrderNotLogin,
  getOrderById,
  getStatusOrder,
  findOrderByCode,
  //   update stock
  updateConfirmedStock,
  updateCompletedStock,
};
