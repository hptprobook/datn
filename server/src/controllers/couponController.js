/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { couponModel } from '~/models/couponModel';
import { StatusCodes } from 'http-status-codes';
import { couponHistoryModel } from '~/models/couponHistoryModel';

// import { ERROR_MESSAGES } from '~/utils/errorMessage';
const getCoupons = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const coupons = await couponModel.getCoupons({ page, limit });
    return res.status(StatusCodes.OK).json(coupons);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getCouponsForOrder = async (req, res) => {
  try {
    const currentDate = new Date();
    const orderTotal = req.orderTotal;

    // Lấy danh sách mã giảm giá
    let coupons = await couponModel.getCouponsForOrder();

    // Lấy lịch sử sử dụng mã giảm giá của người dùng hiện tại
    const userCouponHistory = await couponHistoryModel.getCouponHistoryByParams(
      {
        userId: req.user.user_id,
      }
    );

    // Map couponId thành danh sách để kiểm tra nhanh
    const usedCouponIds = new Set(
      userCouponHistory.map((history) => history.couponId)
    );

    // Lọc mã giảm giá hợp lệ
    coupons = coupons.filter((coupon) => {
      // Kiểm tra trạng thái
      if (coupon.status !== 'active') return false;

      // Kiểm tra thời hạn sử dụng
      const startDate = new Date(coupon.dateStart);
      const endDate = new Date(coupon.dateEnd);
      if (currentDate < startDate || currentDate > endDate) return false;

      // Kiểm tra số lượng sử dụng
      if (coupon.usageLimit) {
        const usageCount = coupon.usageCount || 0; // Nếu có `usageCount` trong couponModel
        if (usageCount >= coupon.usageLimit) return false;
      }

      // Kiểm tra giới hạn sử dụng trên người dùng
      if (coupon.limitOnUser && usedCouponIds.has(coupon._id.toString()))
        return false;

      // Kiểm tra điều kiện giá trị đơn hàng nếu có orderTotal
      if (orderTotal !== undefined) {
        if (coupon.minPurchasePrice && orderTotal < coupon.minPurchasePrice)
          return false;
        if (coupon.maxPurchasePrice && orderTotal > coupon.maxPurchasePrice)
          return false;
      }

      return true;
    });

    // Phân loại mã giảm giá
    const categorizedCoupons = {
      shipping: [],
      order: [],
    };

    coupons.forEach((coupon) => {
      if (coupon.type === 'percent' || coupon.type === 'price') {
        categorizedCoupons.order.push(coupon);
      } else if (coupon.type === 'shipping') {
        categorizedCoupons.shipping.push(coupon);
      }
    });

    return res.status(StatusCodes.OK).json(categorizedCoupons);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra, xin thử lại sau', error: error });
  }
};

const getCouponsById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await couponModel.getCouponsById(id);
    return res.status(StatusCodes.OK).json(coupon);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};
const findOneCoupons = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Thiếu mã giảm giá',
      });
    }
    const coupon = await couponModel.findOneCoupons(code);
    return res.status(StatusCodes.OK).json(coupon);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

const createCoupon = async (req, res) => {
  try {
    const dataCoupon = req.body;
    if (dataCoupon.discountPercent) {
      dataCoupon.discountValue = dataCoupon.discountPercent;
      delete dataCoupon.discountPercent;
    }
    if (dataCoupon.code) {
      const check = await couponModel.findOneCoupons(dataCoupon.code);
      if (check) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ messages: 'Mã giảm giá đã tồn tại' });
      }
    }
    const result = await couponModel.createCoupon(dataCoupon);
    if (result.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ messages: 'Tạo mã giảm giá thành công' });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(result);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const dataCoupon = req.body;
    if (dataCoupon.discountPercent) {
      dataCoupon.discountValue = dataCoupon.discountPercent;
      delete dataCoupon.discountPercent;
    }
    const result = await couponModel.updateCoupon(id, dataCoupon);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const dataDel = await couponModel.deleteCoupon(id);
    if (dataDel.acknowledged) {
      return res
        .status(StatusCodes.OK)
        .json({ messages: 'Xoá mã giảm giá thành công' });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(dataDel);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

const deleteManyCoupon = async (req, res) => {
  try {
    const { ids } = req.body;

    await couponModel.deleteManyCoupons(ids);

    return res.status(StatusCodes.OK).json({
      message: 'Xóa thành công',
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getCouponsByType = async (req, res) => {
  try {
    const { type } = req.query; // Extract type from query parameters
    if (!type) {
      return res.status(400).json({ message: 'Loại là bắt buộc' });
    }

    const coupons = await couponModel.getCouponsByType(type);
    return res.status(StatusCodes.OK).json(coupons);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
  }
};

const checkCouponApplicability = async (req, res) => {
  const { code, purchaseAmount } = req.body;
  const userId = req.user.user_id;

  try {
    const { user, coupon } = await couponModel.getCouponAndUser(userId, code);

    if (!user || !coupon) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không tìm thấy phiếu giảm giá, vui lòng thử lại',
      });
    }

    const couponHistory = await couponHistoryModel.getCouponHistoryByParams({
      userId: userId,
      couponId: coupon._id.toString(),
    });

    if (couponHistory.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Phiếu giảm giá này đã được sử dụng bởi người dùng.',
      });
    }

    const eligibleUsers = coupon.eligibleUsers || [];

    const isUserEligible =
      eligibleUsers.length === 0 || eligibleUsers.includes(userId);

    if (coupon.status !== 'active') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Phiếu giảm giá không hoạt động',
        coupon,
      });
    }

    // Check coupon validity period
    const currentDate = new Date();
    if (
      currentDate < new Date(coupon.dateStart) ||
      currentDate > new Date(coupon.dateEnd)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Phiếu giảm giá đã hết hạn hoặc chưa có hiệu lực',
        coupon,
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Phiếu giảm giá đã sử dụng hết số lần cho phép',
        coupon,
      });
    }

    // Check if the user is eligible for the coupon
    if (coupon.limitOnUser && !isUserEligible) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Người dùng không đủ điều kiện để sử dụng phiếu giảm giá này',
        coupon,
      });
    }

    // Check purchase amount
    if (
      purchaseAmount < coupon.minPurchasePrice ||
      purchaseAmount > coupon.maxPurchasePrice
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Số tiền mua hàng phải nằm trong khoảng từ ${coupon.minPurchasePrice} đến ${coupon.maxPurchasePrice}`,
        coupon,
      });
    }

    // // Record the coupon usage
    // if (coupon.usageLimit) {
    //   await couponModel.updateCouponUsage(code, userId);
    // }
    // if (userId && code) {
    //   await couponHistoryModel.addCouponHistory({
    //     userId: userId,
    //     code: code,
    //     discountAmount: coupon.discountValue,
    //   });
    // }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Phiếu giảm giá có thể sử dụng',
      coupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Có lỗi xảy ra khi kiểm tra tính khả dụng của phiếu giảm giá',
    });
  }
};
export const couponController = {
  createCoupon,
  getCoupons,
  getCouponsForOrder,
  updateCoupon,
  findOneCoupons,
  deleteCoupon,
  deleteManyCoupon,
  getCouponsById,
  getCouponsByType,
  checkCouponApplicability,
};
