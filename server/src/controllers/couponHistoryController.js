import { StatusCodes } from 'http-status-codes';
import { couponHistoryModel } from '~/models/couponHistoryModel';
const getCouponHistory = async (req, res) => {
  try {
    const { orderId, userId, couponId } = req.query;
    const filter = {};
    if (couponId) filter.couponId = couponId;
    if (orderId) filter.orderId = orderId;
    if (userId) filter.userId = userId;
    const couponHistory = await couponHistoryModel.getCouponHistory(filter);
    return res.status(StatusCodes.OK).json(couponHistory);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};
const addCouponHistory = async (req, res) => {
  try {
    const couponHistory = req.body;
    const result = await couponHistoryModel.addCouponHistory(couponHistory);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ messages: 'Thêm lịch sử mã giảm giá thành công' });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra khi thêm lịch sử sử dụng coupon',
    });
  }
};

const getCouponHistoryByParams = async (req, res) => {
  try {
    const { userId, orderId, couponId } = req.body;

    const history = await couponHistoryModel.getCouponHistoryByParams({ userId, orderId, couponId });

    res.status(StatusCodes.OK).json({
      message: 'Lấy lịch sử sử dụng coupon thành công',
      data: history,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra khi lấy lịch sử sử dụng coupon',
    });
  }
};
export const couponUsageController = {
    addCouponHistory,
    getCouponHistoryByParams,
    getCouponHistory
}
