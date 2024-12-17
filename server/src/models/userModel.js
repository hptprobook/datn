import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import {
  SAVE_USER_SCHEMA,
  UPDATE_USER,
  INFO_USER,
  SEND_NOTIFIES,
} from '~/utils/schema/userSchema';

const OrderStatus = {
  pending: 'chờ xác nhận',
  confirmed: 'đã xác nhận',
  shipped: 'đã giao cho ĐVVC',
  shipping: 'shipper đang trên đường tới',
  delivered: 'đã nhận hàng',
  returned: 'trả hàng',
  cancelled: 'huỷ',
  completed: 'hoàn thành',
};

const generateDescription = (title, orderCode, status) => {
  const statusText = OrderStatus[status];
  return `${title} ${orderCode} ${statusText}`;
};

const validateBeforeUpdateInfor = async (data) => {
  return await INFO_USER.validateAsync(data, { abortEarly: false });
};

const validateBeforeSendNotifies = async (data) => {
  return await SEND_NOTIFIES.validateAsync(data, { abortEarly: false });
};

const validateBeforeCreate = async (data) => {
  return await SAVE_USER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const countUserAll = async () => {
  const db = await GET_DB().collection('users');
  const d = await db.countDocuments();
  return d;
};

const getUserAll = async ({ userId, page, limit, start }) => {
  page = Number(page) || 1;
  limit = parseInt(limit);
  const db = await GET_DB().collection('users');
  const skip = parseInt(start) ? parseInt(start) : (page - 1) * limit;
  const count = await db.countDocuments();
  const result = await db
    .find({ _id: { $ne: new ObjectId(userId) } })
    .project({
      password: 0,
      carts: 0,
      notifies: 0,
      favorites: 0,
      addresses: 0,
    })
    .skip(skip)
    .limit(limit)
    .toArray();
  return {
    count,
    result,
  };
};

const register = async (dataUser) => {
  const validData = await validateBeforeCreate(dataUser);
  const db = await GET_DB();
  const collection = db.collection('users');
  const result = await collection.insertOne(validData);
  const user = await collection.findOne({ _id: result.insertedId });
  return user;
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

  if (user && user.notifies && user.notifies.length > 100) {
    user.notifies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestNotifies = user.notifies.slice(0, 100);

    await db.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { notifies: latestNotifies } }
    );

    user.notifies = latestNotifies;
  }

  return user;
};

const getNotifiesUserID = async (user_id) => {
  const db = await GET_DB().collection('users');
  const user = await db.findOne({ _id: new ObjectId(user_id) });

  if (user && user.notifies) {
    user.notifies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (user.notifies.length > 100) {
      const latestNotifies = user.notifies.slice(0, 100);

      await db.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { notifies: latestNotifies } }
      );

      user.notifies = latestNotifies;
    }
  }

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

const removeCart = async (id, data) => {
  const result = await GET_DB()
    .collection('users')
    .findOneAndUpdate({ _id: new ObjectId(id) }, data, {
      returnDocument: 'after',
    });
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
    {
      projection: {
        _id: 1,
        name: 1,
        thumbnail: 1,
        price: 1,
        reviews: 1,
        slug: 1,
      },
    }
  );

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  if (product.reviews && product.reviews.length > 0) {
    const total = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    product.averageRating = parseFloat(
      (total / product.reviews.length).toFixed(1)
    );
    product.totalComment = product.reviews.length;
  } else {
    product.averageRating = 0;
    product.totalComment = 0;
  }

  const result = await dbUsers.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $push: {
        favorites: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          thumbnail: product.thumbnail,
          price: product.price,
          reviews: product.reviews,
          totalComment: product.totalComment,
          averageRating: product.averageRating,
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
    {
      projection: {
        _id: 1,
        name: 1,
        thumbnail: 1,
        price: 1,
        reviews: 1,
        slug: 1,
      },
    }
  );

  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }

  if (product.reviews && product.reviews.length > 0) {
    const total = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    product.averageRating = parseFloat(
      (total / product.reviews.length).toFixed(1)
    );
    product.totalComment = product.reviews.length;
  } else {
    product.averageRating = 0;
    product.totalComment = 0;
  }

  const result = await db.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $push: {
        views: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          thumbnail: product.thumbnail,
          price: product.price,
          reviews: product.reviews,
          totalComment: product.totalComment,
          averageRating: product.averageRating,
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
  //   const { userId, ...otherData } = data;
  //   console.log(data);

  //   const status = otherData.status[otherData.status.length - 1];
  //   const dataValidate = await validateBeforeSendNotifies([status]);
  const { userId, title, description, type, orderId, orderCode } = data;
  const dataValidate = await validateBeforeSendNotifies(data);

  // const description = generateDescription(
  //   otherData.title,
  //   otherData.orderCode,
  //   dataValidate[0].status
  // );

  const result = await GET_DB()
    .collection('users')
    .findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          notifies: {
            _id: new ObjectId(),
            title: title,
            description: description,
            type: type,
            orderId: orderId,
            orderCode: orderCode,
            isReaded: false,
            createdAt: dataValidate.createdAt,
            updatedAt: dataValidate.updatedAt,
          },
        },
      },
      { returnDocument: 'after' }
    );

  delete result.password;
  return result;
};

const readNotify = async (id, data) => {
  const result = await GET_DB()
    .collection('users')
    .updateOne(
      { 'notifies._id': new ObjectId(id) },
      {
        $set: {
          'notifies.$.isReaded': data.isReaded,
          'notifies.$.updatedAt': new Date(),
        },
      }
    );

  return result;
};

const findUsers = async ({ search, page = 1, limit = 10 }) => {
  const db = await GET_DB().collection('users');
  const count = await db.countDocuments({
    $or: [
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ],
  });
  const result = await db
    .find({
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ],
    })
    .project({
      password: 0,
      carts: 0,
      notifies: 0,
      favorites: 0,
      addresses: 0,
    })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .toArray();
  return {
    count,
    result,
  };
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
  removeCart,
  favoriteProduct,
  getFavorite,
  removeFavoriteProduct,
  getView,
  viewProduct,
  updateInfor,
  sendNotifies,
  findUsers,
  readNotify,
  getNotifiesUserID,
};
