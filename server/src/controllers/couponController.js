/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { couponModel } from '~/models/couponModel';
import { StatusCodes } from 'http-status-codes';
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
}
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

export const getCouponsByType = async (req, res) => {
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

export const couponController = {
  createCoupon,
  getCoupons,
  updateCoupon,
  findOneCoupons,
  deleteCoupon,
  deleteManyCoupon,
  getCouponsById,
  getCouponsByType
};
