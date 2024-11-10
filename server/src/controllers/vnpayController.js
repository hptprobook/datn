/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { StatusCodes } from 'http-status-codes';
// import { ERROR_MESSAGES } from '~/utils/errorMessage';
import moment from 'moment';
import { env } from '~/config/environment';
import { orderModel } from '~/models/orderModel';
import querystring from 'qs';

const getUrlVnPay = async (req, res) => {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = 'QSY6QCVM';
    let secretKey = 'LHQREIUFBFTFWJIHMAMBEVSMDFHMSPZT';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    let returnUrl = env.CLIENT_URL + 'thanh-toan/xac-nhan';

    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không được để trống mã đơn hàng hoặc giá',
      });
    }

    let bankCode = '';
    let locale = '';
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan maGD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'Update Pro';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    // Url
    return res.status(StatusCodes.OK).json({ url: vnpUrl });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
  }
};

const vnpay_return = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = 'LHQREIUFBFTFWJIHMAMBEVSMDFHMSPZT';
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Mã lỗi 97 - chữ ký không hợp lệ',
        code: 97,
      });
    }

    const orderData = await orderModel.findOrderByCode(orderId);
    if (!orderData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Không tìm thấy đơn hàng',
      });
    }

    if (responseCode === '00') {
      await orderModel.updateOrder(orderData._id, {
        status: 'pending',
        note: 'Đơn hàng chờ xác nhận',
      });
      return res.redirect(
        `${env.CLIENT_URL}/thanh-toan/xac-nhan?status=success&orderId=${orderId}`
      );
    } else {
      await orderModel.deleteOrder(orderData._id);
      return res.redirect(
        `${env.CLIENT_URL}/thanh-toan/xac-nhan?status=failure&orderId=${orderId}&code=${responseCode}`
      );
    }
  } catch (error) {
    console.error('Error handling VNPAY return:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Lỗi xử lý đơn hàng từ VNPAY',
      error,
    });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export const vnpayController = {
  getUrlVnPay,
  vnpay_return,
};
