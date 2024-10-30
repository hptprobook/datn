import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_ORDER,
  UPDATE_ORDER,
  SAVE_ORDER_NOT_LOGIN,
  SAVE_ORDER_AT_STORE,
  UPDATE_ORDER_AT_STORE,
} from '~/utils/schema/orderSchema';

const validateBeforeCreate = async (data) => {
  return await SAVE_ORDER.validateAsync(data, { abortEarly: false });
};
const validateBeforeCreateNot = async (data) => {
  return await SAVE_ORDER_NOT_LOGIN.validateAsync(data, {
    abortEarly: false,
  });
};
const validateBeforeCreateAtStore = async (data) => {
  return await SAVE_ORDER_AT_STORE.validateAsync(data, {
    abortEarly: false,
  });
};
const validateBeforeUpdate = async (data) => {
  return await UPDATE_ORDER.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdateStore = async (data) => {
  return await UPDATE_ORDER_AT_STORE.validateAsync(data, { abortEarly: false });
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

const getCurrentOrder = async (user_id) => {
  const db = await GET_DB().collection('orders');
  const result = await db.find({ userId: new ObjectId(user_id) }).toArray();
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

const addOrderAtStore = async (dataOrder) => {
  const validData = await validateBeforeCreateAtStore(dataOrder);
  const db = await GET_DB();
  const collection = db.collection('orders');
  const data = {
    ...validData,
    staffId: new ObjectId(dataOrder.staffId),
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

const updateOrderAtStore = async (id, data) => {
  const validatedData = await validateBeforeUpdateStore(data);
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
      },
    },
    {
      arrayFilters: [{ 'size.size': data.variantSize }],
    }
  );
  return result;
};

export const orderModel = {
  // store
  addOrderAtStore,
  updateOrderAtStore,
  //
  getAllOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getCurrentOrder,
  getOrderByCode,
  findCartById,
  checkStockProducts,
  updateSingleProductStock,
  // updateStockProducts,
  addOrderNotLogin,
  getOrderById,
  getStatusOrder,
  findOrderByCode,
};
