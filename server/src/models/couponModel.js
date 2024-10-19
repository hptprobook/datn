import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { CREATE_COUPONS, UPDATE_COUPONS } from '~/utils/schema/couponSchema';

const validateBeforeCreate = async (data) => {
  return await CREATE_COUPONS.validateAsync(data, { abortEarly: false });
};

const getCoupons = async () => {
  // page = parseInt(page) || 1;
  // limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('coupons');
  const result = await db
    .find()
    // .skip((page - 1) * limit)
    // .limit(limit)
    .toArray();
  return result;
};
const findOneCoupons = async (code) => {
  const db = await GET_DB().collection('coupons');
  const result = await db.findOne({
    code: code,
  });
  return result;
};

const createCoupon = async (dataCoupon) => {
  const validData = await validateBeforeCreate(dataCoupon);
  const db = await GET_DB();
  const collection = db.collection('coupons');
  const data = {
    ...validData,
    applicableProducts: validData.applicableProducts.map((item) => {
      return new ObjectId(item.applicableProducts);
    }),
  };
  const result = await collection.insertOne(data);
  return result;
};

const validateBeforeUpdate = async (data) => {
  return await UPDATE_COUPONS.validateAsync(data, { abortEarly: false });
};

const updateCoupon = async (id, dataCoupon) => {
  const validData = await validateBeforeUpdate(dataCoupon);
  const db = await GET_DB();
  const collection = db.collection('coupons');
  if (validData.applicableProducts) {
    const data = {
      ...validData,
      applicableProducts: validData.applicableProducts.map((item) => {
        return new ObjectId(item.applicableProducts);
      }),
    };
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    return result;
  }
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: validData },
    { returnDocument: 'after' }
  );
  return result;
};

const deleteCoupon = async (id) => {
  const db = GET_DB().collection('coupons');
  const result = await db.deleteOne({ _id: new ObjectId(id) });
  return result;
};

const deleteManyCoupons = async (ids) => {
  const db = GET_DB().collection('coupons');

  const result = await db.deleteMany({
    _id: { $in: ids.map((id) => new ObjectId(id)) },
  });

  if (result.deletedCount === 0) {
    throw new Error('Xóa không thành công');
  }

  return {
    result,
  };
};

export const couponModel = {
  createCoupon,
  getCoupons,
  updateCoupon,
  findOneCoupons,
  deleteCoupon,
  deleteManyCoupons,
};
