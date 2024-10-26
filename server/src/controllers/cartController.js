/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { cartModel } from '~/models/cartModel';

const getCurentCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const dataCart = await cartModel.getCurentCarts(user_id);
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

const addCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id, variantColor, variantSize, quantity } = req.body;
    if (!id || !variantColor || !variantSize || !quantity) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin của sản phẩm' });
    }
    // Kiểm tra user có sp trong giỏ hàng chưa
    const check1 = await cartModel.findCartById(user_id);
    if (check1) {
      // kiểm tra thuộc tính sản phẩm
      const check2 = await cartModel.findCart(
        user_id,
        variantColor,
        variantSize
      );
      if (check2) {
        // Thêm số lượng
        const dataAddQtt = {
          _id: req.body.id,
          quantity: req.body.quantity,
          variantColor: req.body.variantColor,
          variantSize: req.body.variantSize,
        };
        await cartModel.addQuantityCart(user_id, dataAddQtt);
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Thêm số lượng vô giỏ hàng thành công' });
      }

      // Thêm thuộc tính mới
      const dataPush = {
        _id: req.body.id,
        ...req.body,
      };
      delete dataPush.id;
      await cartModel.addNewCart(user_id, dataPush);
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
    }
    const data = req.body;
    await cartModel.addCart(user_id, data);
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const addMultipleCarts = async (req, res) => {
  try {
    const { user_id } = req.user;
    const carts = req.body.carts; // Lấy mảng carts từ body của request

    console.log(carts);

    if (!Array.isArray(carts) || carts.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu thông tin giỏ hàng hoặc giỏ hàng trống' });
    }

    // Duyệt từng cart trong mảng và thêm vào database
    for (const cart of carts) {
      const { id, variantColor, variantSize, quantity } = cart;
      if (!id || !variantColor || !variantSize || !quantity) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Thiếu thông tin sản phẩm trong giỏ hàng' });
      }

      // Kiểm tra user có sản phẩm trong giỏ hàng chưa
      const check1 = await cartModel.findCartById(user_id);
      if (check1) {
        // kiểm tra thuộc tính sản phẩm
        const check2 = await cartModel.findCart(
          user_id,
          variantColor,
          variantSize
        );
        if (check2) {
          // Thêm số lượng nếu đã tồn tại
          const dataAddQtt = {
            _id: id,
            quantity: quantity,
            variantColor: variantColor,
            variantSize: variantSize,
          };
          await cartModel.addQuantityCart(user_id, dataAddQtt);
        } else {
          // Thêm thuộc tính mới
          const dataPush = {
            _id: id,
            ...cart,
          };
          delete dataPush.id;
          await cartModel.addNewCart(user_id, dataPush);
        }
      } else {
        // Nếu user chưa có giỏ hàng, tạo mới
        await cartModel.addCart(user_id, cart);
      }
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Thêm nhiều sản phẩm vào giỏ hàng thành công' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra, xin thử lại sau', error });
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
    await cartModel.removeCart(user_id, dataDel);
    const data = await cartModel.getCurentCarts(user_id);
    if (data.products.length == 0) {
      await cartModel.deleteCart(user_id);
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
    await cartModel.addNewCart(user_id, data);
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
    const dataCart = await cartModel.updateCart(user_id, dataUpdate);
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
//     const dataUser = await cartModel.deleteUser(id);
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
export const cartsController = {
  addCart,
  getCurentCart,
  updateCart,
  // getAllCarts,
  // deleteCart,
  addNewCart,
  addMultipleCarts,
  // updateCurentCart,
  removeCart,
};
