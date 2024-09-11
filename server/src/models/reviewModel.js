import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { SAVE_REVIEW, UPDATE_REVIEW } from '~/utils/schema';

const validateBeforeCreate = async (data) => {
  return await SAVE_REVIEW.validateAsync(data, { abortEarly: false });
};
const validateBeforeUpdate = async (data) => {
  return await UPDATE_REVIEW.validateAsync(data, { abortEarly: false });
};
// const countUserAll = async () => {
//   const db = await GET_DB().collection('carts');
//   const totail = await db.countDocuments();
//   return totail;
// };

const getAllReview = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 2;
  const db = await GET_DB().collection('reviews');
  const result = await db
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    // .project({ _id: 0, age:1 })
    .toArray();
  return result;
};

const getCurentReview = async (user_id) => {
  const db = await GET_DB().collection('orders');
  const result = await db
    .find({ userId: new ObjectId(user_id) })
    // .project({ products: 1, userId: 0, _id: 0 })
    .toArray();
  return result;
};

const addReview = async (dataOrder) => {
  const validData = await validateBeforeCreate(dataOrder);
  const db = await GET_DB();
  const collection = db.collection('reviews');
  const data = {
    ...validData,
    user_id: new ObjectId(validData.user_id),
    order_id: new ObjectId(validData.order_id),
  };
  const result = await collection.insertOne(data);
  return result;
};

const updateReview = async (id, data) => {
  const dataVal = await validateBeforeUpdate(data);
  const result = await GET_DB()
    .collection('reviews')
    .findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: dataVal },
      { returnDocument: 'after' }
    );
  delete result._id;
  delete result.user_id;
  return result;
};

const deleteReview = async (id) => {
  const result = await GET_DB()
    .collection('reviews')
    .deleteOne({
      _id: new ObjectId(id),
    });
  return result;
};

export const reviewModel = {
  getAllReview,
  addReview,
  updateReview,
  deleteReview,
  getCurentReview,
};
