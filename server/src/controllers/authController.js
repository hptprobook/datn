import { authModel } from '~/models/authModel';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { sendMail } from '~/utils/mail';
import { createToken, createRefreshToken } from '~/utils/helper';
// import { userModel } from '~/models/userModel';
import jwt from 'jsonwebtoken';
import https from 'https';

const register = async (req, res) => {
  try {
    const dataRegister = req.body;
    const { email, password } = dataRegister;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không bỏ trống Email',
      });
    }
    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không bỏ trống Mật khẩu',
      });
    }
    const user = await authModel.getUserEmail(email);
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tài khoản đã tồn tại' });
    }
    const hash = await bcrypt.hashSync(password, 8);
    if (!hash) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi bảo mật xảy ra' });
    }

    const data = {
      ...dataRegister,
      password: hash,
    };
    const dataUser = await authModel.register(data); // Assuming you have this function
    if (dataUser) {
      const refreshToken = createRefreshToken(dataUser);
      await authModel.update(dataUser._id, { refreshToken });
      delete dataUser.password;
      dataUser.token = createToken(dataUser);
      dataUser.refreshToken = refreshToken;
      return res.status(StatusCodes.OK).json(dataUser);
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Đăng kí thất bại' });
  } catch (error) {
    if (error.details) {
      return res.status(StatusCodes.BAD_REQUEST).json(error.details[0].message);
    }
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.REQUIRED });
    }
    const user = await authModel.getUserEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.WRONG_ACCOUNT });
    }
    if (user.role == 'ban') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.BAN });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.WRONG_ACCOUNT });
    }
    // Token
    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    await authModel.update(user._id, { refreshToken });
    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // Để cho phép cookie hoạt động trên các origin khác nhau
    };
    user.token = token;
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.refreshToken;
    return res
      .cookie('refreshToken', refreshToken, tokenOption)
      .status(StatusCodes.OK)
      .json(user);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const logout = async (req, res) => {
  return await res.clearCookie('refreshToken').status(StatusCodes.OK).json({
    message: 'Đăng xuất thành công',
  });
};

const getOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Thiếu thông tin email',
      });
    }
    const user = await authModel.getUserEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email không tồn tại' });
    }
    if (user.role == 'ban') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tài khoản của bạn đang tạm khóa' });
    }
    const otp = Math.random().toString(36).slice(2, 8).toUpperCase();
    await authModel.updateByEmail(email, otp);
    const subject = 'Mã OTP của bạn';
    const html = `<h2>${otp}</h2>`;
    await sendMail(email, subject, html);
    return res.status(StatusCodes.OK).json({
      message: 'Kiểm tra mã OTP trong gmail của bạn',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

const checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không bỏ trống thông tin email và mã otp' });
    }
    const user = await authModel.getUserEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email không tồn tại' });
    }
    if (user.role == 'ban') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tài khoản của bạn đang tạm khóa' });
    }
    if (user.otp === otp) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Nhập mật khẩu mới của bạn' });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Mã otp không hợp lệ' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

const changePassWordByOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Không bỏ trống thông tin email hoặc password',
      });
    }
    const user = await authModel.getUserEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email không tồn tại' });
    }
    if (user.role == 'ban') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Tài khoản của bạn đang tạm khóa' });
    }

    const hash = await bcrypt.hashSync(password, 8);
    if (!hash) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi bảo mật xảy ra' });
    }
    const data = {
      password: hash,
    };
    const dataUser = await authModel.update(user._id.toString(), data);
    if (dataUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Đổi mật khẩu thành công' });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie thay vì req.body
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Thiếu dữ liệu refresh token' });
    }
    const token_secret = process.env.REFRESH_SECRET;
    const decodedToken = jwt.verify(refreshToken, token_secret);
    const { user_id } = decodedToken;

    // Tìm user dựa trên user_id từ token
    const user = await authModel.findUserID(user_id);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Xác thực không thành công. Vui lòng đăng nhập lại',
      });
    }
    if (user.refreshToken !== refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Xác thực không thành công. Vui lòng đăng nhập lại',
      });
    }

    // Tạo access token mới
    const token = createToken(user);

    // Trả về token mới
    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    // Xử lý các lỗi liên quan đến JWT
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: 'Phiên đăng nhập đã hết hạn' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: 'Không đúng định dạng dữ liệu' });
    }
    if (error instanceof jwt.NotBeforeError) {
      return res.status(401).send({ message: 'Dữ liệu không hoạt động' });
    }

    // Xử lý các lỗi khác
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

const sendSMS = (req, res) => {
  const { phoneNumbers, message } = req.body;

  var options = {
    method: 'POST',
    hostname: '388q11.api.infobip.com',
    path: '/sms/2/text/advanced',
    headers: {
      Authorization:
        'App 6d63ec2412fcb421db2c2d8d14ad0f6e-55681b98-beaa-4bdb-90d1-1961ad02c0d1',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    maxRedirects: 20,
  };

  var reqSms = https.request(options, function (resSms) {
    var chunks = [];

    resSms.on('data', function (chunk) {
      chunks.push(chunk);
    });

    resSms.on('end', function () {
      var body = Buffer.concat(chunks);
      res
        .status(200)
        .json({ message: 'Mã OTP đã được gửi đi', data: body.toString() });
    });

    resSms.on('error', function (error) {
      res.status(500).json({ message: 'Gửi tin nhắn thất bại', error });
    });
  });

  const destinations = phoneNumbers.map((phoneNumber) => ({ to: phoneNumber }));

  var postData = JSON.stringify({
    messages: [
      {
        destinations,
        from: '447491163443',
        text: message || 'Mã OTP của bạn là 123456',
      },
    ],
  });

  reqSms.write(postData);
  reqSms.end();
};

export const authController = {
  getOtp,
  register,
  login,
  logout,
  checkOtp,
  changePassWordByOtp,
  refreshToken,
  sendSMS,
};
