import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_USER_SCHEMA,
  UPDATE_USER,
  INFOR_USER,
  SEND_NOTIFIES,
} from '~/utils/schema/userSchema';

const validateBeforeUpdateInfor = async (data) => {
  return await INFOR_USER.validateAsync(data, { abortEarly: false });
};

const validateBeforeSendNotifies = async (data) => {
  return await SEND_NOTIFIES.validateAsync(data, { abortEarly: false });
};

const validateBeforeCreate = async (data) => {
  return await SAVE_USER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countUserAll = async () => {
  const db = await GET_DB().collection('users');
  const totail = await db.countDocuments();
  return totail;
};

const getUserAll = async (page, limit, user_id) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 2;
  const db = await GET_DB().collection('users');
  const result = await db
    .find({ _id: { $ne: new ObjectId(user_id) } })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return result;
};

const register = async (dataUser) => {
  const validData = await validateBeforeCreate(dataUser);
  const db = await GET_DB();
  const collection = db.collection('users');
  const result = await collection.insertOne(validData);
  return result;
};

const getUserEmail = async (email) => {
  const db = await GET_DB();
  const collection = db.collection('users');
  const user = await collection.findOne({ email: email });
  return user;
};

const getUserID = async (user_id) => {
  const db = await GET_DB().collection('users');
  const user = await db.findOne({ _id: new ObjectId(user_id) });
  return user;
};
const validateBeforeUpdate = async (data) => {
  return await UPDATE_USER.validateAsync(data, { abortEarly: false });
};

const update = async (id, data) => {
  const dataValidate = await validateBeforeUpdate(data);

  if (dataValidate.addresses) {
    const address = dataValidate.addresses;
    const addressList = address.map((item) => ({
      ...item,
      _id: item._id ? new ObjectId(item._id) : new ObjectId(),
    }));
    dataValidate.addresses = addressList;
  }

  const result = await GET_DB()
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataValidate },
      { returnDocument: 'after' }
    );
  delete result.password;
  return result;
};

const updateByEmail = async (email, otp) => {
  const result = await GET_DB()
    .collection('users')
    .updateOne({ email: email }, { $set: { otp: otp } });
  return result;
};

const deleteUser = async (id, role) => {
  const result = await GET_DB()
    .collection('users')
    .findOne({ _id: new ObjectId(id) }, { projection: { role: 1 } });
  if (result.role === 'root') {
    return { error: 'Bạn không đủ thẩm quyền' };
  }
  if (result.role === 'admin' && role === 'admin') {
    return { error: 'Bạn không đủ thẩm quyền' };
  }
  return await GET_DB()
    .collection('users')
    .deleteOne({ _id: new ObjectId(id) });
};

const favoriteProduct = async (id, userId) => {
  const dbUsers = GET_DB().collection('users');
  const dbProducts = GET_DB().collection('products');

  const product = await dbProducts.findOne(
    { _id: new ObjectId(id) },
    { projection: { _id: 1, name: 1, thumbnail: 1, price: 1, reviews: 1 } }
  );

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const result = await dbUsers.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $push: {
        favorites: {
          _id: product._id,
          name: product.name,
          image: product.thumbnail,
          price: product.price,
          reviews: product.reviews,
        },
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  return result;
};

const viewProduct = async (id, userId) => {
  const db = GET_DB().collection('users');
  const dbProducts = GET_DB().collection('products');

  const product = await dbProducts.findOne(
    { _id: new ObjectId(id) },
    { projection: { _id: 1, name: 1, thumbnail: 1, price: 1, reviews: 1 } }
  );

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $push: {
        views: {
          _id: product._id,
          name: product.name,
          image: product.thumbnail,
          price: product.price,
          reviews: product.reviews,
        },
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  return result;
};

const removeFavoriteProduct = async (id, userId) => {
  const db = GET_DB().collection('users');

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $pull: {
        favorites: new ObjectId(id),
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error('Có lỗi xảy ra, xin thử lại sau');
  }

  return result;
};

const getFavorite = async (id, userId) => {
  const db = GET_DB().collection('users');

  const result = await db.updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: {
        favorites: { _id: new ObjectId(id) },
      },
    }
  );
  if (result.modifiedCount === 0) {
    return null;
  }
  return result;
};

const getView = async (id, userId) => {
  const db = GET_DB().collection('users');

  const result = await db.updateOne(
    { _id: new ObjectId(userId) },
    {
      $pull: {
        views: { _id: new ObjectId(id) },
      },
    }
  );
  if (result.modifiedCount === 0) {
    return null;
  }
  return result;
};
// update infor
const updateInfor = async (id, data) => {
  const dataValidate = await validateBeforeUpdateInfor(data);
  const result = await GET_DB()
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataValidate },
      { returnDocument: 'after' }
    );
  delete result.password;
  return result;
};

const sendNotifies = async (data) => {
  const { userId, ...otherData } = data;

  const status = otherData.status[otherData.status.length - 1];

  const dataValidate = await validateBeforeSendNotifies([status]);

  const result = await GET_DB()
    .collection('users')
    .findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          notifies: {
            _id: otherData._id,
            status: dataValidate[0].status,
            note: dataValidate[0].note,
            createdAt: dataValidate[0].createdAt,
            updatedAt: dataValidate[0].updatedAt,
          },
        },
      },
      { returnDocument: 'after' }
    );
  delete result.password;
  return result;
};

export const userModel = {
  getUserAll,
  register,
  getUserEmail,
  getUserID,
  update,
  countUserAll,
  deleteUser,
  updateByEmail,
  favoriteProduct,
  getFavorite,
  removeFavoriteProduct,
  getView,
  viewProduct,
  updateInfor,
  sendNotifies,
};
