/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';

const getAllOrder = async (req, res) => {
  try {
    // const { user_id } = req.user;
    const orders = await orderModel.getAllOrders();
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
    const curentOrder = await orderModel.getCurentOrder(user_id);
    return res.status(StatusCodes.BAD_REQUEST).json(curentOrder);
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
        // console.log(_id, quantity, color, size);
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

const removeOrder = async (req, res) => {
  try {
    const { idOrder } = req.params;
    if (!idOrder) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin đơn hàng' });
    }
    await orderModel.deleteOrder(idOrder);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const data = req.body;
    console.log(data);
    const dataOrder = await orderModel.updateOrder(idOrder, data);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Cập nhật thông tin thành công', dataOrder });
  } catch (error) {
    console.log(error);
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
const checkStockProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Hãy gửi 1 mảng sản phẩm' });
    }

    if (req.body.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin sản phẩm' });
    }
    // Kiểm tra thông tin sản phẩm

    for (let { _id, quantity, vars } of req.body) {
      if (!_id || !vars.color || !vars.size || !quantity) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Thiếu thông tin của sản phẩm' });
      }
    }
    let a = false;
    const checkPromises = req.body.map(async (item) => {
      const product = await orderModel.checkStockProducts(item);
      if (product.length > 0) {
        const quantityProduct = product[0].vars[0].stock;
        if (quantityProduct < item.quantity) {
          a = true;
          return {
            id: item._id,
            message: `Không đủ số lượng còn: ${quantityProduct}`,
          };
        }
      } else {
        a = true;
        return {
          id: item._id,
          message: 'Không có sản phẩm',
        };
      }
    });

    const results = await Promise.all(checkPromises);
    const filteredResults = results.filter((n) => n);
    if (a) {
      return res.status(StatusCodes.BAD_REQUEST).json(filteredResults);
    }
    return res.status(StatusCodes.OK).json({ message: 'Có thể mua hàng' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const updateStockProducts = async (req, res) => {
  try {
    await orderModel.updateStockProducts();
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Cập nhật số lượng sản phẩm' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

export const orderController = {
  checkStockProducts,
  addOrder,
  getCurentOrder,
  updateOrder,
  removeOrder,
  getAllOrder,
  updateStockProducts,
};
