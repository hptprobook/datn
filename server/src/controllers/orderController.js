/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { orderModel } from '~/models/orderModel';
import { sendMail } from '~/utils/mail';
import { userModel } from '~/models/userModel';
import { recieptModel } from '~/models/receiptModel';
import { orderStatus } from '~/utils/format';
import { ObjectId } from 'mongodb';
import { couponHistoryModel } from '~/models/couponHistoryModel';
import { staffsModel } from '~/models/staffsModel';
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
    const { page, limit, sort } = req.query;
    const { user_id } = req.user;
    const currentOrder = await orderModel.getCurrentOrder(
      user_id,
      page,
      limit,
      sort
    );
    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const getCurrentOrderByStatus = async (req, res) => {
  try {
    const { status, page, limit, sort } = req.query;
    const { user_id } = req.user;
    const currentOrder = await orderModel.getCurrentOrderByStatus(
      user_id,
      status,
      page,
      limit,
      sort
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

const searchCurrentOrder = async (req, res) => {
  try {
    const { keyword, page, limit, sort } = req.query;
    const { user_id } = req.user;

    const currentOrder = await orderModel.searchCurrentOrder(
      user_id,
      keyword,
      page,
      limit,
      sort
    );

    return res.status(StatusCodes.OK).json(currentOrder);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    const { user_id } = req.user;
    const dataOrder = { userId: user_id, ...req.body };

    // Kiểm tra phương thức thanh toán
    if (dataOrder.paymentMethod === 'VNPAY') {
      dataOrder.status = [
        {
          status: 'paymentPending',
          note: 'Chờ khách hàng thanh toán',
        },
      ];
    }

    // Thêm đơn hàng vào cơ sở dữ liệu
    const result = await orderModel.addOrder(dataOrder);
    const orderData = await orderModel.getOrderById(result.insertedId);

    // Gửi thông báo qua Socket.IO
    const notifyData = {
      userId: new ObjectId(dataOrder.userId),
      title: 'Cảm ơn bạn đã đặt hàng tại BMT Life',
      description: `Đơn hàng #${dataOrder.orderCode} của bạn đã được đặt thành công.`,
      type: 'order',
      orderId: result.insertedId.toString(),
      orderCode: dataOrder.orderCode,
    };

    const staffs = await staffsModel.getStaffs();
    staffs.forEach((staff) => {
      req.io.to(staff._id.toString()).emit('newOrder', {
        message: 'Có đơn hàng mới cần xử lý',
        order: orderData,
      });
    });

    // Gửi email xác nhận đặt hàng
    const email = req.user.email;
    const subject = 'Cảm ơn bạn đã đặt hàng tại BMT Life';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #dddddd;
                border-radius: 0 0 5px 5px;
            }
            .order-details {
                background-color: white;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                border: 1px solid #eeeeee;
            }
            .order-code {
                font-size: 24px;
                color: #4CAF50;
                font-weight: bold;
                text-align: center;
                margin: 15px 0;
            }
            .customer-info {
                margin: 15px 0;
            }
            .info-item {
                padding: 8px 0;
                border-bottom: 1px solid #eeeeee;
            }
            .total-price {
                font-size: 18px;
                color: #e53935;
                font-weight: bold;
                text-align: right;
                margin-top: 15px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-links a {
                margin: 0 10px;
                color: #4CAF50;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 15px 0;
            }
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100%;
                    padding: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>BMT Life</h1>
                <p>Xác nhận đơn hàng của bạn</p>
            </div>
            
            <div class="content">
                <h2>Xin chào ${dataOrder.shippingInfo.name}!</h2>
                <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại <strong>BMT Life</strong>! 
                   Đơn hàng của bạn đã được tiếp nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.</p>
                
                <div class="order-code">
                    Mã đơn hàng: ${dataOrder.orderCode}
                </div>
                
                <div class="order-details">
                    <h3>Thông tin đơn hàng:</h3>
                    <div class="customer-info">
                        <div class="info-item">
                            <strong>Tên khách hàng:</strong> ${dataOrder.shippingInfo.name
      }
                        </div>
                        <div class="info-item">
                            <strong>Email:</strong> ${email}
                        </div>
                        <div class="info-item">
                            <strong>Số điện thoại:</strong> ${dataOrder.shippingInfo.phone
      }
                        </div>
                        <div class="info-item">
                            <strong>Địa chỉ giao hàng:</strong> ${dataOrder.shippingInfo.fullAddress
      }
                        </div>
                        <div class="total-price">
                            Tổng tiền: ${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(dataOrder.totalPrice)}
                        </div>
                    </div>
                </div>

                <p>Bạn có thể theo dõi trạng thái đơn hàng bằng cách click vào nút bên dưới:</p>
                <center>
                    <a href="${process.env.CLIENT_URL}nguoi-dung/don-hang/${dataOrder.orderCode
      }" class="button">
                        Theo dõi đơn hàng
                    </a>
                </center>

                <div class="footer">
                    <p>Cảm ơn bạn đã lựa chọn BMT Life!</p>
                    <div class="social-links">
                        <a href="https://facebook.com/bmtlife">Facebook</a> |
                        <a href="https://instagram.com/bmtlife">Instagram</a> |
                        <a href="https://twitter.com/bmtlife">Twitter</a>
                    </div>
                    <p>
                        <small>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email bmtlife@gmail.com 
                        hoặc số điện thoại 0322 741 249</small>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    await sendMail(email, subject, html);

    // Lưu lịch sử coupon nếu có
    if (dataOrder.couponId && dataOrder.couponId.length > 0) {
      for (const couponId of dataOrder.couponId) {
        const usageData = {
          userId: dataOrder.userId,
          couponId,
          orderId: result.insertedId.toString(),
          discountAmount: dataOrder.discountPrice || 0,
          status: 'successful',
        };
        await couponHistoryModel.addCouponHistory(usageData);
      }
    }

    // Gửi thông báo chung nếu không dùng VNPAY
    if (dataOrder.paymentMethod !== 'VNPAY') {
      await userModel.sendNotifies(notifyData);
    }

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

function generateSecretKey(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const addOrderNot = async (req, res) => {
  try {
    const dataOrder = req.body;
    const { orderCode, email, shippingInfo, totalPrice } = dataOrder;

    const secretKey = generateSecretKey(16);
    dataOrder.secretKey = secretKey;

    // Kiểm tra nếu mã đơn hàng đã tồn tại
    const currentOrder = await orderModel.findOrderByCode(orderCode);
    if (currentOrder) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Hệ thống đang bận, xin hãy thử lại sau',
      });
    }

    // Xử lý trạng thái khi thanh toán qua VNPAY
    if (dataOrder.paymentMethod === 'VNPAY') {
      dataOrder.status = [
        {
          status: 'paymentPending',
          note: 'Chờ khách hàng thanh toán',
        },
      ];
    }

    console.log(dataOrder);

    // Thêm đơn hàng mới vào cơ sở dữ liệu
    const result = await orderModel.addOrderNotLogin(dataOrder);

    // Gửi email xác nhận đặt hàng
    const subject = 'Cảm ơn bạn đã đặt hàng tại BMT Life';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #dddddd;
                border-radius: 0 0 5px 5px;
            }
            .order-details {
                background-color: white;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                border: 1px solid #eeeeee;
            }
            .order-code {
                font-size: 24px;
                color: #4CAF50;
                font-weight: bold;
                text-align: center;
                margin: 15px 0;
            }
            .customer-info {
                margin: 15px 0;
            }
            .info-item {
                padding: 8px 0;
                border-bottom: 1px solid #eeeeee;
            }
            .total-price {
                font-size: 18px;
                color: #e53935;
                font-weight: bold;
                text-align: right;
                margin-top: 15px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-links a {
                margin: 0 10px;
                color: #4CAF50;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 15px 0;
            }
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100%;
                    padding: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>BMT Life</h1>
                <p>Xác nhận đơn hàng của bạn</p>
            </div>
            
            <div class="content">
                <h2>Xin chào ${shippingInfo.name}!</h2>
                <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại <strong>BMT Life</strong>! 
                   Đơn hàng của bạn đã được tiếp nhận và chúng tôi sẽ xử lý trong thời gian sớm nhất.</p>
                
                <div class="order-code">
                    Mã đơn hàng: ${orderCode}
                </div>
                
                <div class="order-details">
                    <h3>Thông tin đơn hàng:</h3>
                    <div class="customer-info">
                        <div class="info-item">
                            <strong>Tên khách hàng:</strong> ${shippingInfo.name
      }
                        </div>
                        <div class="info-item">
                            <strong>Email:</strong> ${email}
                        </div>
                        <div class="info-item">
                            <strong>Số điện thoại:</strong> ${shippingInfo.phone
      }
                        </div>
                        <div class="info-item">
                            <strong>Địa chỉ giao hàng:</strong> ${shippingInfo.fullAddress
      }
                        </div>
                        <div class="total-price">
                            Tổng tiền: ${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(totalPrice)}
                        </div>
                        <div class="secret-key">
                            Mã bảo mật: <strong>${secretKey}</strong>
                        </div>
                    </div>
                </div>

                <p>Bạn có thể theo dõi trạng thái đơn hàng bằng cách click vào nút bên dưới:</p>
                <center>
                    <a href="${process.env.CLIENT_URL
      }theo-doi-don-hang" class="button">
                        Theo dõi đơn hàng
                    </a>
                </center>

                <div class="footer">
                    <p>Cảm ơn bạn đã lựa chọn BMT Life!</p>
                    <div class="social-links">
                        <a href="https://facebook.com/bmtlife">Facebook</a> |
                        <a href="https://instagram.com/bmtlife">Instagram</a> |
                        <a href="https://twitter.com/bmtlife">Twitter</a>
                    </div>
                    <p>
                        <small>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email bmtlife@gmail.com 
                        hoặc số điện thoại 0322 741 249</small>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    await sendMail(email, subject, html);

    // Lấy dữ liệu đơn hàng để trả về phản hồi
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

    const orderData = await orderModel.getOrderById(idOrder);
    if (!orderData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (orderData.couponId && orderData.couponId.length > 0) {
      for (const couponId of orderData.couponId) {
        await couponHistoryModel.deleteCouponHistory({
          userId: orderData.userId,
          orderId: idOrder,
          couponId: couponId,
        });
      }
    }

    // Xóa đơn hàng
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
      // const check = oldStatus.some((item) => item.status === data.status);
      // const checkReturn = oldStatus.some((item) => item.status === 'returned' && item.returnStatus === data?.returnStatus);
      // if (checkReturn) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     message: 'Trạng thái đơn hàng bị trùng lặp vui lòng kiểm tra lại',
      //   });
      // }
      const newStatus = [...oldStatus, data.status];
      data.status = newStatus;
    }
    const dataOrder = await orderModel.updateOrder(id, data);
    if (dataOrder) {
      const endStatus = dataOrder.status.at(-1).status;
      const statusInVietnamese = orderStatus[endStatus] || endStatus;
      const notifyData = {
        userId: dataOrder.userId,
        title: `Cập nhật thông tin cho đơn hàng #${dataOrder.orderCode}`,
        description: `Đơn hàng #${dataOrder.orderCode} của bạn hiện đã chuyển sang trạng thái "${statusInVietnamese}". Vui lòng kiểm tra thông tin trong chi tiết đơn hàng.`,
        type: 'order',
        orderCode: dataOrder.orderCode,
        status: endStatus,
      };

      req.io
        .to(dataOrder.userId.toString())
        .emit('orderStatusUpdate', notifyData);

      delete notifyData.status;
      delete notifyData.note;

      await userModel.sendNotifies(notifyData);

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

        // Gửi email khi đơn hàng hoàn thành
        const email = req.user.email; // Assuming user's email is available in req.user
        const subject = 'Đơn hàng của bạn đã hoàn thành';
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #dddddd;
                    border-radius: 0 0 5px 5px;
                }
                .order-details {
                    background-color: white;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                    border: 1px solid #eeeeee;
                }
                .order-code {
                    font-size: 24px;
                    color: #4CAF50;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                }
                .customer-info {
                    margin: 15px 0;
                }
                .info-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #eeeeee;
                }
                .total-price {
                    font-size: 18px;
                    color: #e53935;
                    font-weight: bold;
                    text-align: right;
                    margin-top: 15px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
                }
                .social-links {
                    margin: 15px 0;
                }
                .social-links a {
                    margin: 0 10px;
                    color: #4CAF50;
                    text-decoration: none;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 15px 0;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        width: 100%;
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>BMT Life</h1>
                    <p>Đơn hàng của bạn đã hoàn thành</p>
                </div>
                
                <div class="content">
                    <h2>Xin chào ${dataOrder.shippingInfo.name}!</h2>
                    <p>Đơn hàng #${dataOrder.orderCode
          } của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại <strong>BMT Life</strong>.</p>
                    
                    <div class="order-code">
                        Mã đơn hàng: ${dataOrder.orderCode}
                    </div>
                    
                    <div class="order-details">
                        <h3>Thông tin đơn hàng:</h3>
                        <div class="customer-info">
                            <div class="info-item">
                                <strong>Tên khách hàng:</strong> ${dataOrder.shippingInfo.name
          }
                            </div>
                            <div class="info-item">
                                <strong>Email:</strong> ${email}
                            </div>
                            <div class="info-item">
                                <strong>Số điện thoại:</strong> ${dataOrder.shippingInfo.phone
          }
                            </div>
                            <div class="info-item">
                                <strong>Địa chỉ giao hàng:</strong> ${dataOrder.shippingInfo.fullAddress
          }
                            </div>
                            <div class="total-price">
                                Tổng tiền: ${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(dataOrder.totalPrice)}
                            </div>
                        </div>
                    </div>

                    <p>Bạn có thể theo dõi trạng thái đơn hàng bằng cách click vào nút bên dưới:</p>
                    <center>
                        <a href="${process.env.CLIENT_URL
          }/theo-doi-don-hang" class="button">
                            Theo dõi đơn hàng
                        </a>
                    </center>

                    <div class="footer">
                        <p>Cảm ơn bạn đã lựa chọn BMT Life!</p>
                        <div class="social-links">
                            <a href="https://facebook.com/bmtlife">Facebook</a> |
                            <a href="https://instagram.com/bmtlife">Instagram</a> |
                            <a href="https://twitter.com/bmtlife">Twitter</a>
                        </div>
                        <p>
                            <small>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email bmtlife@gmail.com 
                            hoặc số điện thoại 0322 741 249</small>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        await sendMail(email, subject, html);
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

const updateOrderNotLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Kiểm tra secretKey
    const { secretKey } = data;
    const order = await orderModel.getOrderById(id);

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Không tìm thấy đơn hàng',
      });
    }

    if (!secretKey || order.secretKey !== secretKey) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Mã bảo mật không hợp lệ',
      });
    }

    delete data.secretKey;

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

        // Gửi email khi đơn hàng hoàn thành
        const email = order.email; // Assuming order's email is available
        const subject = 'Đơn hàng của bạn đã hoàn thành';
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #dddddd;
                    border-radius: 0 0 5px 5px;
                }
                .order-details {
                    background-color: white;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                    border: 1px solid #eeeeee;
                }
                .order-code {
                    font-size: 24px;
                    color: #4CAF50;
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                }
                .customer-info {
                    margin: 15px 0;
                }
                .info-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #eeeeee;
                }
                .total-price {
                    font-size: 18px;
                    color: #e53935;
                    font-weight: bold;
                    text-align: right;
                    margin-top: 15px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
                }
                .social-links {
                    margin: 15px 0;
                }
                .social-links a {
                    margin: 0 10px;
                    color: #4CAF50;
                    text-decoration: none;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 15px 0;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        width: 100%;
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>BMT Life</h1>
                    <p>Đơn hàng của bạn đã hoàn thành</p>
                </div>
                
                <div class="content">
                    <h2>Xin chào ${dataOrder.shippingInfo.name}!</h2>
                    <p>Đơn hàng #${dataOrder.orderCode
          } của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại <strong>BMT Life</strong>.</p>
                    
                    <div class="order-code">
                        Mã đơn hàng: ${dataOrder.orderCode}
                    </div>
                    
                    <div class="order-details">
                        <h3>Thông tin đơn hàng:</h3>
                        <div class="customer-info">
                            <div class="info-item">
                                <strong>Tên khách hàng:</strong> ${dataOrder.shippingInfo.name
          }
                            </div>
                            <div class="info-item">
                                <strong>Email:</strong> ${email}
                            </div>
                            <div class="info-item">
                                <strong>Số điện thoại:</strong> ${dataOrder.shippingInfo.phone
          }
                            </div>
                            <div class="info-item">
                                <strong>Địa chỉ giao hàng:</strong> ${dataOrder.shippingInfo.fullAddress
          }
                            </div>
                            <div class="total-price">
                                Tổng tiền: ${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(dataOrder.totalPrice)}
                            </div>
                        </div>
                    </div>

                    <p>Bạn có thể theo dõi trạng thái đơn hàng bằng cách click vào nút bên dưới:</p>
                    <center>
                        <a href="${process.env.CLIENT_URL
          }/theo-doi-don-hang" class="button">
                            Theo dõi đơn hàng
                        </a>
                    </center>

                    <div class="footer">
                        <p>Cảm ơn bạn đã lựa chọn BMT Life!</p>
                        <div class="social-links">
                            <a href="https://facebook.com/bmtlife">Facebook</a> |
                            <a href="https://instagram.com/bmtlife">Instagram</a> |
                            <a href="https://twitter.com/bmtlife">Twitter</a>
                        </div>
                        <p>
                            <small>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email bmtlife@gmail.com 
                            hoặc số điện thoại 0322 741 249</small>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        await sendMail(email, subject, html);
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

        const quantityProduct = product[0].variants[0].sizes[0].sale;
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
  searchCurrentOrder,
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
