/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { userModel } from '~/models/userModel';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '~/config/environment';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { sendMail } from '~/utils/mail';

const getCurrentUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await userModel.getUserID(user_id);
    delete user.password;
    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại người dùng' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserID(id);
    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại người dùng' });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const getUserByEmail = async (req, res) => {
  // use
  try {
    const { email } = req.params;
    const user = await userModel.getUserEmail(email);
    if (user) {
      return res.status(StatusCodes.OK).json({
        user,
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Không tồn tại người dùng' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json('Có lỗi xảy ra xin thử lại sau');
  }
};

const register = async (req, res) => {
  // use
  try {
    const { email, password, firstName, lastName, ...other } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED,
      });
    }
    const user = await userModel.getUserEmail(email);
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
      email,
      name: {
        firstName,
        lastName,
      },
      password: hash,
      ...other,
    };
    const dataUser = await userModel.register(data);
    if (dataUser.acknowledged) {
      return res.status(StatusCodes.OK).json({ message: 'Đăng kí thành công' });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Đăng kí thất bại' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Có lỗi xảy ra xin thử lại sau', error });
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
    const user = await userModel.getUserEmail(email);
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
    const dataToken = {
      user_id: user._id,
      email: user.email,
    };
    // 30 ngày
    const time = 60 * 60 * 24 * 30;
    const token = jwt.sign(dataToken, env.SECRET, { expiresIn: time });
    const tokenOption = {
      httpOnly: true,
      secure: true,
    };
    user.token = token;
    delete user.password;
    return res
      .cookie('token_wow', token, tokenOption)
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
  return await res.clearCookie('token_wow').status(StatusCodes.OK).json({
    message: 'Đăng xuất thành công',
  });
};

const changePassWord = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { oldPassWord, password } = req.body;
    if (!password || !oldPassWord) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không bỏ trống thông tin' });
    }
    const user = await userModel.getUserID(user_id);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không tồn tại người dùng' });
    }
    const checkPass = await bcrypt.compare(oldPassWord, user.password);
    if (!checkPass) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.WRONG_ACCOUNT });
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
    const dataUser = await userModel.update(user_id, data);
    if (dataUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Cập nhật thông tin thành công', dataUser });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const data = req.body;
    if (data.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Lỗi bảo mật' });
    }
    const dataUser = await userModel.update(user_id, data);
    if (dataUser?.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
    if (dataUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Cập nhật thông tin thành công', dataUser });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.ERR_AGAIN,
      error: error,
    });
  }
};
// admin

const getAllUsers = async (req, res) => {
  try {
    let { pages, limit } = req.query;
    const users = await userModel.getUserAll(pages, limit);
    const countUsers = await userModel.countUserAll();
    return res.status(StatusCodes.OK).json({
      users,
      countUsers,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Lỗi bảo mật' });
    }
    const dataUser = await userModel.update(id, data);
    if (dataUser?.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
    if (dataUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Cập nhật thông tin thành công', dataUser });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUser = await userModel.deleteUser(id);
    if (dataUser?.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    }
    if (dataUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Xóa người dùng thành công' });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Có lỗi xảy ra xin thử lại sau',
      error: error,
    });
  }
};

const getOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Thiếu thông tin email',
      });
    }
    const user = await userModel.getUserEmail(email);
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
    await userModel.updateByEmail(email, otp);
    await sendMail(email, otp);
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
        .json({ message: 'Không bỏ trống thông tin' });
    }
    const user = await userModel.getUserEmail(email);
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Không bỏ trống thông tin' });
    }
    const user = await userModel.getUserEmail(email);
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
    const dataUser = await userModel.update(user._id.toString(), data);
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

export const usersController = {
  getOtp,
  register,
  login,
  logout,
  getUserById,
  getCurrentUser,
  getUserByEmail,
  updateCurrentUser,
  updateUser,
  changePassWord,
  getAllUsers,
  deleteUser,
  checkOtp,
  changePassWordByOtp,
};
