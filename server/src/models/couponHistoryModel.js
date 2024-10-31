import { GET_DB } from '~/config/mongodb';
import { CREATE_COUPON_USAGE_HISTORY } from '~/utils/schema/CouponHistorySchema';
// Hàm để thêm một lịch sử sử dụng coupon

const validateBeforeCreate = async (data) => {
  return await CREATE_COUPON_USAGE_HISTORY.validateAsync(data, { abortEarly: false });
};

const getCouponHistory = async () => {
  // page = parseInt(page) || 1;
   // limit = parseInt(limit) || 12;
   const db = await GET_DB().collection('couponUsageHistory');
   const result = await db
     .find()
     // .skip((page - 1) * limit)
     // .limit(limit)
     .toArray();
   return result;
   }
const addCouponHistory = async (usageData) => {
  const validData = await validateBeforeCreate(usageData);
  const db = await GET_DB();
  const collection = db.collection('couponUsageHistory');
  const data = {
    ...validData
  };
  const result = await collection.insertOne(data);
  return result;
};

// Hàm để lấy lịch sử sử dụng coupon của một người dùng
const getCouponHistorybyUserId = async (userId) => { 
  const db = await GET_DB();
  const couponUsageCollection = db.collection('couponUsageHistory');

  const history = await couponUsageCollection
    .find({ userId })
    .sort({ usageDate: -1 })
    .toArray();

  return history;
};


export const couponHistoryModel = {
    addCouponHistory,
    getCouponHistorybyUserId,
    getCouponHistory
}
