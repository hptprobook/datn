/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { couponModel } from '~/models/couponModel';
import { StatusCodes } from 'http-status-codes';
import { couponHistoryModel } from '~/models/couponHistoryModel';

// import { ERROR_MESSAGES } from '~/utils/errorMessage';
const getCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.getCoupons();
    return res.status(StatusCodes.OK).json(coupons);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const getCouponsForOrder = async (req, res) => {
  try {
    let coupons = await couponModel.getCoupons();

    coupons = await Promise.all(
      coupons.map(async (coupon) => {
        const usageCount = await couponHistoryModel.countCouponHistory({
          couponId: coupon._id,
        });

        if (usageCount >= coupon.usageLimit) {
          return null;
        }

        if (coupon.limitOnUser) {
          const userUsageCount = await couponHistoryModel.countCouponHistory({
            couponId: coupon._id,
            userId: req.user,
          });

          if (userUsageCount >= 1) {
            return null;
          }
        }

        return coupon;
      })
    );

    coupons = coupons.filter((coupon) => coupon !== null);

    const categorizedCoupons = {
      shipping: [],
      order: [],
    };

    coupons.forEach((coupon) => {
      if (coupon.type === 'percent') {
        categorizedCoupons.order.push(coupon);
      } else if (coupon.type === 'shipping') {
        categorizedCoupons.shipping.push(coupon);
      } else if (coupon.type === 'price') {
        categorizedCoupons.order.push(coupon);
      }
    });

    return res.status(StatusCodes.OK).json(categorizedCoupons);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra, xin thử lại sau' });
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
  const { userId, couponId } = req.body;

  try {
    const result = await couponModel.checkCouponApplicability(userId, couponId);
    if (result.applicable) {
      return res.status(StatusCodes.OK).json({
        message: 'Phiếu giảm giá được áp dụng',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: result.message || 'Phiếu giảm giá không được áp dụng',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra, xin thử lại sau',
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
