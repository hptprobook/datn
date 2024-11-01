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
const getCouponsById = async (id) => {
  const db = await GET_DB().collection('coupons');
  const result = await db.findOne({ _id: new ObjectId(id) });
  return result;
}
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
    ...validData
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
const getCouponsByType = async (type) => {
  const db = GET_DB().collection('coupons');
  const result = await db.find({ type }).toArray();
  return result;
};

const checkCouponApplicability = async (userId, couponId) => {
  const db = await GET_DB().collection('coupons');
  const userDb = await GET_DB().collection('users');

  const user = await userDb.findOne({ _id: new ObjectId(userId) });
  const coupon = await db.findOne({ _id: new ObjectId(couponId) });

  if (!user || !coupon) {
    throw new Error('Không tìm thấy người dùng hoặc phiếu giảm giá');
  }

  // Ensure applicableProducts and eligibleUsers are defined
  const applicableProducts = coupon.applicableProducts || [];
  const eligibleUsers = coupon.eligibleUsers || [];


  // Check if the coupon is applicable to all products
  const isApplicableToAllProducts = applicableProducts.length === 0;

  // Check if the user is eligible for the coupon
  const isUserEligible = eligibleUsers.length === 0 || eligibleUsers.includes(userId);


  // Check coupon status
  if (coupon.status !== 'active') {
    return { applicable: false, message: 'Phiếu giảm giá không hoạt động' };
  }

  // Check coupon validity period
  const currentDate = new Date();
  if ( currentDate > new Date(coupon.dateEnd)) {
    return { applicable: false, message: 'Phiếu giảm giá đã hết hạn hoặc chưa có hiệu lực' };
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { applicable: false, message: 'Phiếu giảm giá đã sử dụng hết số lần cho phép' };
  }

  // Check if the user is eligible for the coupon
  if (coupon.limitOnUser && !isUserEligible) {
    return { applicable: false, message: 'Người dùng không đủ điều kiện để sử dụng phiếu giảm giá này' };
  }

  if (isApplicableToAllProducts) {
    return { applicable: true, message: 'Phiếu giảm giá được áp dụng cho tất cả' };
  }
  else {
    return { applicable: false, message: 'Phiếu giảm giá được áp dụng cho một số sản phẩm' };
  }
};

export const couponModel = {
  createCoupon,
  getCoupons,
  updateCoupon,
  findOneCoupons,
  deleteCoupon,
  deleteManyCoupons,
  getCouponsById,
  getCouponsByType,
  checkCouponApplicability
};
