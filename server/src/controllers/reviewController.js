/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { reviewModel } from '~/models/reviewModel';

const getAllOrder = async (req, res) => {
  try {
    // const { user_id } = req.user;
    const orders = await reviewModel.getAllOrders();
    return res.status(StatusCodes.OK).json(orders);
    // return res
    //   .status(StatusCodes.BAD_REQUEST)
    //   .json({ message: 'Không có sản phẩm trong giỏ hàng' });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getCurentOrder = async (req, res) => {
  try {
    const { user_id } = req.user;
    const curentOrder = await reviewModel.getCurentOrder(user_id);
    return res.status(StatusCodes.BAD_REQUEST).json(curentOrder);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { user_id } = req.user;
    const data = { user_id, ...req.body };
    await reviewModel.addReview(data);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Bạn đã bình luận sản phẩm' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const removeReview = async (req, res) => {
  try {
    const { idReview } = req.params;
    if (!idReview) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin đơn hàng' });
    }
    await reviewModel.deleteReview(idReview);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa bình luận thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const updateReview = async (req, res) => {
  try {
    const { idReview } = req.params;
    console.log(idReview);
    const dataReq = req.body;
    const data = await reviewModel.updateReview(idReview, dataReq);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Cập nhật bình luận thành công', data });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};
export const reviewController = {
  addReview,
  getCurentOrder,
  updateReview,
  removeReview,
  getAllOrder,
};
