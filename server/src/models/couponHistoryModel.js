import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { CREATE_COUPON_USAGE_HISTORY } from '~/utils/schema/CouponHistorySchema';
// Hàm để thêm một lịch sử sử dụng coupon

const validateBeforeCreate = async (data) => {
  return await CREATE_COUPON_USAGE_HISTORY.validateAsync(data, {
    abortEarly: false,
  });
};

const getCouponHistory = async (filter) => {
  // page = parseInt(page) || 1;
  // limit = parseInt(limit) || 12;
  const db = await GET_DB().collection('couponUsageHistory');
  const result = await db
    .find()
    .filter(filter)
    // .skip((page - 1) * limit)
    // .limit(limit)
    .toArray();
  return result;
};

const addCouponHistory = async (usageData) => {
  const validData = await validateBeforeCreate(usageData);
  const db = await GET_DB();
  const collection = db.collection('couponUsageHistory');
  const data = {
    ...validData,
  };
  const result = await collection.insertOne(data);
  return result;
};

const countCouponHistory = async ({ couponId, userId }) => {
  const db = await GET_DB();
  const couponUsageCollection = db.collection('couponUsageHistory');

  // Tạo query dựa trên các tham số đầu vào
  const query = {};
  if (userId) query.userId = userId; // Convert userId sang ObjectId nếu cần
  if (couponId) query.couponId = couponId; // Convert couponId sang ObjectId nếu cần

  // Sử dụng countDocuments để đếm số lượng tài liệu thỏa mãn query
  const count = await couponUsageCollection.countDocuments(query);

  return count;
};

// Hàm để lấy lịch sử sử dụng coupon của một người dùng
const getCouponHistoryByParams = async ({ userId, orderId, couponId }) => {
  const db = await GET_DB();
  const couponUsageCollection = db.collection('couponUsageHistory');

  const query = {};
  if (userId) query.userId;
  if (orderId) query.orderId;
  if (couponId) query.couponId;

  const history = await couponUsageCollection
    .find(query)
    .sort({ usageDate: -1 })
    .toArray();

  return history;
};

const deleteCouponHistory = async ({ userId, orderId, couponId }) => {
  const db = await GET_DB();
  const couponUsageCollection = db.collection('couponUsageHistory');

  const query = {};
  if (userId) query.userId = userId;
  if (orderId) query.orderId = orderId;
  if (couponId) query.couponId = couponId;

  const result = await couponUsageCollection.deleteMany(query);
  return result;
};

export const couponHistoryModel = {
  addCouponHistory,
  countCouponHistory,
  getCouponHistoryByParams,
  getCouponHistory,
  deleteCouponHistory,
};
