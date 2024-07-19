/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';

const getAllOrder = async (req, res) => {
  try {
    // const { user_id } = req.user;
    const orders = await orderModel.getAllOrders;
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

const getCurentCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const dataCart = await orderModel.getCurentCarts(user_id);
    if (dataCart) {
      delete dataCart._id;
      delete dataCart.userId;
      delete dataCart.createdAt;
      delete dataCart.updatedAt;
      return res.status(StatusCodes.OK).json(dataCart);
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không có sản phẩm trong giỏ hàng' });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { products } = req.body;
    if (products) {
      products.map((item) => {
        const { _id, quantity } = item;
        const { color, size } = item.vars;
        console.log(_id, quantity, color, size);
      });
    }
    const dataOrder = { userId: user_id, ...req.body };
    await orderModel.addOrder(dataOrder);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Bạn đã đặt hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const removeCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { _id, color, size } = req.query;
    if (!_id || !color || !size) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin của sản phẩm' });
    }
    const dataDel = {
      _id: req.body._id,
      vars: { color: req.body.color, size: req.body.size },
    };
    await orderModel.removeCart(user_id, dataDel);
    const data = await orderModel.getCurentCarts(user_id);
    if (data.products.length == 0) {
      await orderModel.deleteCart(user_id);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const addNewCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const data = req.body;
    await orderModel.addNewCart(user_id, data);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};
const updateCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { _id, color, size, quantity } = req.body;
    if (!_id || !color || !size || !quantity) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin của sản phẩm' });
    }
    const dataUpdate = {
      _id,
      quantity,
      vars: { color: color, size: size },
    };
    const dataCart = await orderModel.updateCart(user_id, dataUpdate);
    delete dataCart._id;
    delete dataCart.userId;
    delete dataCart.createdAt;
    delete dataCart.updatedAt;
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Cập nhật thông tin thành công', dataCart });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};
// const deleteCart = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const dataUser = await orderModel.deleteUser(id);
//     if (dataUser?.error) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
//     }
//     if (dataUser) {
//       return res
//         .status(StatusCodes.OK)
//         .json({ message: 'Xóa người dùng thành công' });
//     }
//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: 'Có lỗi xảy ra xin thử lại sau',
//       error: error,
//     });
//   }
// };
export const orderController = {
  addOrder,
  getCurentCart,
  updateCart,
  // getAllCarts,
  // deleteCart,
  addNewCart,
  // updateCurentCart,
  removeCart,

  getAllOrder,
};
