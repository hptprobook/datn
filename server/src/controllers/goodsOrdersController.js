/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';
import { sendMail } from '~/utils/mail';
import { goodsOrdersModel } from '~/models/goodsOrdersModel';
import { userModel } from '~/models/userModel';
import { warehouseModel } from '~/models/warehouseModel';
import { supplierModel } from '~/models/supplierModel';

const getAllOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const orders = await goodsOrdersModel.getAllGoodsOrders(page, limit);
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await goodsOrdersModel.getGoodsOrderById(id);
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    // const { user_id } = req.user;
    const dataOrder = req.body;
    const totalQuantity = dataOrder.productsList.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    await goodsOrdersModel.checkAndUpdateCapacity(
      totalQuantity,
      dataOrder.warehouseId
    );

    const result = await goodsOrdersModel.addOrder(dataOrder);
    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
    }
    for (const product of dataOrder.productsList) {
      await goodsOrdersModel.updateStock(
        product._id,
        product.variantColor,
        product.variantSize,
        product.quantity
      );
    }

    const orderData = await goodsOrdersModel.getGoodsOrderById(
      result.insertedId
    );
    return res.status(StatusCodes.OK).json({
      message: 'Bạn đã đặt hàng thành công',
      data: orderData,
    });
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    console.log(error.toString());
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: typeof error === 'string' ? error : error.toString() });
  }
};

const sendReceipt = async (data) => {
  try {
    const user = await userModel.getUserID(data.userId);
    const warehouse = await warehouseModel.getWarehouseById(data.warehouseId);
    const supplier = await supplierModel.getSupplierById(data.supplierId);
    const subject = `Hóa đơn nhập hàng kho của ${warehouse.name}`;
    const html = `
                <h2>Xin chào, bạn!</h2>
                <p>Người dùng ${user.name} đã nhập ${
      data.productsList.length
    } sản phẩm</p>
                <p>Nhà cung cấp là: <strong>${supplier.companyName}</strong></p>
                <p>Mã đơn hàng của bạn là: <strong>${
                  data.goodsOrderCode
                }</strong></p>
                <h3>Thông tin đơn hàng:</h3>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Màu sắc</th>
            <th>Kích thước</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          ${data.productsList
            .map(
              (product) => `
              <tr>
                <td>${product.name}</td>
              <td><img src="https:${product.image}" alt="${
                product.name
              }" style="width: 50px; height: auto;" /></td>
                <td>${product.variantColor}</td>
                <td>${product.variantSize}</td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.quantity}</td>
                <td>${product.itemTotal.toLocaleString()} VND</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
                <p>Tổng tiền là: <strong>${data.totalPrice}</strong></p>
                <p>Trân trọng,<br />Đội ngũ Wow store</p>
            `;
    await sendMail(user.email, subject, html);
  } catch (error) {
    throw new Error(error);
  }
};

const findOrderByCode = async (req, res) => {
  try {
    const { orderCode } = req.params;

    const currentOrder = await goodsOrdersModel.findOrderByCode(orderCode);
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

    const order = await goodsOrdersModel.getGoodsOrderById(idOrder);
    if (!order) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Không tồn tại đơn hàng' });
    }

    const result = await goodsOrdersModel.deleteOrder(idOrder);
    if (!result) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Có lỗi xảy ra. Vui lòng thử lại' });
    }

    for (const product of order.productsList) {
      const currentStock = await goodsOrdersModel.getCurrentStock(
        product._id,
        product.variantColor,
        product.variantSize
      );

      if (currentStock - product.quantity >= 0) {
        await goodsOrdersModel.updateStock(
          product._id,
          product.variantColor,
          product.variantSize,
          -product.quantity
        );
      } else {
        console.log(
          `Không thể giảm stock của sản phẩm ${product._id} - Màu: ${product.variantColor} - Size: ${product.variantSize} vì sẽ dẫn đến stock âm`
        );
      }
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Xóa đơn hàng thành công và cập nhật stock' });
  } catch (error) {
    console.log(error);

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
      const oldStatus = await goodsOrdersModel.getStatusOrder(id);
      const check = oldStatus.some((i) => data.status[0].status === i.status);
      if (check) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Trạng thái đơn hàng bị trùng lặp vui lòng kiểm tra lại',
        });
      }
      const newStatus = [...oldStatus, data.status[0]];
      data.status = newStatus;
    }
    const dataOrder = await goodsOrdersModel.updateOrder(id, data);

    if (dataOrder) {
      if (data.status[data.status.length - 1].status === 'completed') {
        await sendReceipt(dataOrder);
      }
    }
    return res.status(StatusCodes.OK).json(dataOrder);
  } catch (error) {
    console.log(error);

    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

export const goodsOrderController = {
  addOrder,
  updateOrder,
  removeOrder,
  getAllOrder,
  getOrderById,
  findOrderByCode,
};
