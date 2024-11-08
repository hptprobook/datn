/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';
import { sendMail } from '~/utils/mail';
import { userModel } from '~/models/userModel';
import { recieptModel } from '~/models/receiptModel';
const getAllOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const orders = await orderModel.getAllOrders(page, limit);
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getCurrentOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { user_id } = req.user;
    const currentOrder = await orderModel.getCurrentOrder(user_id, page, limit);
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const getCurrentOrderByStatus = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const { user_id } = req.user;
    const currentOrder = await orderModel.getCurrentOrderByStatus(
      user_id,
      status,
      page,
      limit
    );
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const getOrderByStatus = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const currentOrder = await orderModel.getOrderByStatus(status, page, limit);
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getOrderByCode = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { orderCode } = req.params;

    const currentOrder = await orderModel.getOrderByCode(orderCode, user_id);

    if (!currentOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập',
      });
    }
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    return res.status(StatusCodes.OK).json(error);
  }
};

const addOrder = async (req, res) => {
  try {
    const { user_id } = req.user;
    const dataOrder = { userId: user_id, ...req.body };
    const result = await orderModel.addOrder(dataOrder);
    const orderData = await orderModel.getOrderById(result.insertedId);
    return res.status(StatusCodes.OK).json({
      message: 'Bạn đã đặt hàng thành công',
      data: orderData,
    });
  } catch (error) {
    console.log(error);
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const addOrderNot = async (req, res) => {
  try {
    const dataOrder = req.body;
    const { orderCode, email, shippingInfo, totalPrice } = dataOrder;
    const currentOrder = await orderModel.findOrderByCode(orderCode);
    if (currentOrder) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Hệ thống đang bận xin hãy thử lại sau',
      });
    }
    const result = await orderModel.addOrderNotLogin(dataOrder);
    const subject = 'Cảm ơn bạn đã đặt hàng tại Wow store';
    const html = `
            <h2>Xin chào, bạn!</h2>
            <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại <strong>BMT Life</strong>! Đơn hàng của bạn đã được tiếp nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.</p>
            <p>Mã đơn hàng của bạn là: <strong>${orderCode}</strong></p>
            <p>Bạn có thể theo dõi trạng thái đơn hàng qua email này hoặc đăng nhập vào tài khoản của bạn tại website của chúng tôi.</p>
            <h3>Thông tin đơn hàng:</h3>
            <ul>
                <li><strong>Tên khách hàng:</strong> ${shippingInfo.name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Số điện thoại:</strong> ${shippingInfo.phone}</li>
                <li><strong>Địa chỉ giao hàng:</strong> ${shippingInfo.detailAddress}</li>
                <li><strong>Tổng tiền:</strong> ${totalPrice} VND</li>
            </ul>
            <p>Chúng tôi sẽ gửi thông báo khi đơn hàng được vận chuyển. Cảm ơn bạn đã lựa chọn Wow store, và chúng tôi hy vọng bạn sẽ hài lòng với sản phẩm của mình!</p>
            <p>Trân trọng,<br />Đội ngũ Wow store</p>
        `;
    await sendMail(email, subject, html);

    const orderData = await orderModel.getOrderById(result.insertedId);

    return res.status(StatusCodes.OK).json({
      message:
        'Bạn đã đặt hàng thành công, kiểm tra mã đơn hàng trong email của bạn',
      data: orderData,
    });
  } catch (error) {
    console.log(error);
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

function code(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const findOrderByCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const currentOrder = await orderModel.findOrderByCode(orderCode);
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    return res.status(StatusCodes.OK).json(error);
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
    const { id } = req.params;
    const data = req.body;
    if (data.status) {
      const oldStatus = await orderModel.getStatusOrder(id);
      //   const check = oldStatus.some((i) => data.status.status === i.status);
      //   if (check) {
      //     return res.status(StatusCodes.BAD_REQUEST).json({
      //       message: 'Trạng thái đơn hàng bị trùng lặp vui lòng kiểm tra lại',
      //     });
      //   }
      const newStatus = [...oldStatus, data.status];
      data.status = newStatus;
    }
    const dataOrder = await orderModel.updateOrder(id, data);
    if (dataOrder) {
      const endStatus = dataOrder.status.at(-1).status;
      //  trạng thái xác nhận trừ số lượng
      if (endStatus == 'confirmed') {
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateConfirmedStock(item);
          })
        );
      }
      //   trạng thái trả hàng, hủy cộng số lượng
      if (endStatus == 'returned' || endStatus == 'cancelled') {
        await recieptModel.updateReturnedReceipt(dataOrder._id.toString());
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: -item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateConfirmedStock(item);
          })
        );
      }
      //  trạng thái hoàn thành tạo hóa đơn
      if (endStatus == 'completed') {
        // cập nhật số lượng kho
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateCompletedStock(item);
          })
        );

        const dataReceipt = {
          orderId: dataOrder._id.toString(),
          receiptCode: code(6).toUpperCase(),
          name: dataOrder.shippingInfo.name,
          phone: dataOrder.shippingInfo.phone,
          status: 'success',
          total: dataOrder.totalPrice,
          productsList: dataOrder.productsList.map((item) => {
            return {
              _id: item._id.toString(),
              quantity: item.quantity,
              image: item.image,
              name: item.name,
              price: item.price,
              variantColor: item.variantColor,
              variantSize: item.variantSize,
              sku: item.sku,
              weight: item.weight,
            };
          }),
          amountPaidBy: dataOrder.totalPrice,
          amountPaidTo: 0,
          discount: dataOrder.discountPrice,
          paymentMethod: dataOrder.paymentMethod,
          type: 'online',
          note: 'Đơn hàng được giao thành công',
        };
        const dataEnd = {
          ...dataReceipt,
          productsList: dataReceipt.productsList.map((item) => {
            return {
              ...item,
              _id: item._id.toString(),
            };
          }),
        };
        await recieptModel.addReceipt(dataEnd);
      }
    }
    dataOrder.type = 'order';
    dataOrder.title = 'Đơn hàng';
    if (dataOrder) {
      await userModel.sendNotifies(dataOrder);
    }
    return res.status(StatusCodes.OK).json(dataOrder);
  } catch (error) {
    console.log(error);
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updateOrderNotLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.status) {
      const oldStatus = await orderModel.getStatusOrder(id);
      const check = oldStatus.some((i) => data.status.status === i.status);
      if (check) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Trạng thái đơn hàng bị trùng lặp vui lòng kiểm tra lại',
        });
      }
      const newStatus = [...oldStatus, data.status];
      data.status = newStatus;
    }
    const dataOrder = await orderModel.updateOrder(id, data);
    if (dataOrder) {
      const endStatus = dataOrder.status.at(-1).status;
      //  trạng thái xác nhận trừ số lượng
      if (endStatus == 'confirmed') {
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateConfirmedStock(item);
          })
        );
      }
      //   trạng thái trả hàng, hủy cộng số lượng
      if (endStatus == 'returned' || endStatus == 'cancelled') {
        await recieptModel.updateReturnedReceipt(dataOrder._id.toString());
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: -item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateConfirmedStock(item);
          })
        );
      }
      //  trạng thái hoàn thành tạo hóa đơn
      if (endStatus == 'completed') {
        // cập nhật số lượng kho
        const newProducts = dataOrder.productsList.map((item) => {
          return {
            productId: item._id.toString(),
            name: item.name,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            quantity: item.quantity,
          };
        });
        await Promise.all(
          newProducts.map(async (item) => {
            await orderModel.updateCompletedStock(item);
          })
        );

        const dataReceipt = {
          orderId: dataOrder._id.toString(),
          receiptCode: code(6).toUpperCase(),
          name: dataOrder.shippingInfo.name,
          phone: dataOrder.shippingInfo.phone,
          status: 'success',
          total: dataOrder.totalPrice,
          productsList: dataOrder.productsList.map((item) => {
            return {
              _id: item._id.toString(),
              quantity: item.quantity,
              image: item.image,
              name: item.name,
              price: item.price,
              variantColor: item.variantColor,
              variantSize: item.variantSize,
              sku: item.sku,
              weight: item.weight,
            };
          }),
          amountPaidBy: dataOrder.totalPrice,
          amountPaidTo: 0,
          discount: dataOrder.discountPrice,
          paymentMethod: dataOrder.paymentMethod,
          type: 'online',
          note: 'Đơn hàng được giao thành công',
        };
        const dataEnd = {
          ...dataReceipt,
          productsList: dataReceipt.productsList.map((item) => {
            return {
              ...item,
              _id: item._id.toString(),
            };
          }),
        };
        await recieptModel.addReceipt(dataEnd);
      }
    }
    return res.status(StatusCodes.OK).json(dataOrder);
  } catch (error) {
    console.log(error);
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const checkStockProducts = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'Hãy gửi thông tin sản phẩm đúng định dạng và không được bỏ trống.',
      });
    }

    for (const {
      //   id,
      productId,
      variantColor,
      variantSize,
      name,
      quantity,
    } of products) {
      if (!productId || !name || !variantColor || !variantSize || !quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Thiếu thông tin của sản phẩm',
        });
      }
    }

    const results = await Promise.all(
      products.map(async (item) => {
        const product = await orderModel.checkStockProducts(item);

        if (!product.length) {
          return {
            success: false,
            productId: item.productId,
            name: item.name,
            requestedQuantity: item.quantity,
            availableQuantity: 0,
            message: `${item.name} đã ngưng bán hoặc có lỗi xảy ra`,
          };
        }

        const quantityProduct = product[0].variants[0].sizes[0].stock;
        if (quantityProduct < item.quantity) {
          return {
            id: item.id,
            success: false,
            productId: item.productId,
            name: item.name,
            requestedQuantity: item.quantity,
            availableQuantity: quantityProduct,
            type: `${item.variantColor} - ${item.variantSize}`,
          };
        }

        return {
          id: item.id,
          success: true,
          productId: item.productId,
          name: item.name,
          requestedQuantity: item.quantity,
          availableQuantity: quantityProduct,
          type: `${item.variantColor} - ${item.variantSize}`,
        };
      })
    );

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const updateStockProducts = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'Hãy gửi thông tin sản phẩm đúng định dạng và không được bỏ trống.',
      });
    }

    for (const {
      productId,
      variantColor,
      variantSize,
      name,
      quantity,
    } of products) {
      if (!productId || !name || !variantColor || !variantSize || !quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Thiếu thông tin của sản phẩm',
        });
      }
    }
    const results = await Promise.all(
      products.map(async (item) => {
        const updateResult = await orderModel.updateSingleProductStock(item);
        if (updateResult.modifiedCount === 0) {
          return {
            productId: item.productId,
            message: `${item.name} không đủ tồn kho hoặc không tìm thấy sản phẩm.`,
          };
        }
        return null;
      })
    );
    const failedUpdates = results.filter((result) => result !== null);

    if (failedUpdates.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(failedUpdates);
    }

    return res.status(StatusCodes.OK).json({
      message: 'Cập nhật tồn kho thành công.',
    });
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
  addOrderNot,
  getCurrentOrder,
  getOrderByCode,
  updateOrder,
  removeOrder,
  getAllOrder,
  updateStockProducts,
  getOrderById,
  findOrderByCode,
  updateOrderNotLogin,
  getCurrentOrderByStatus,
  getOrderByStatus,
};
