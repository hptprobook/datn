/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { authModel } from '~/models/authModel';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '~/config/environment';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { sendMail } from '~/utils/mail';

const register = async(req, res) => {
    try {
        const dataRegister = req.body;
        const { email, password } = dataRegister;
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                mgs: 'Không bỏ trống Email',
            });
        }
        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                mgs: 'Không bỏ trống Mật khẩu',
            });
        }
        const user = await authModel.getUserEmail(email);
        if (user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Tài khoản đã tồn tại' });
        }
        const hash = await bcrypt.hashSync(password, 8);
        if (!hash) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Có lỗi bảo mật xảy ra' });
        }

        const data = {
            ...dataRegister,
            password: hash,
        };
        const dataUser = await authModel.register(data); // Assuming you have this function
        if (dataUser.acknowledged) {
            return res.status(StatusCodes.OK).json({ mgs: 'Đăng kí thành công' });
        }
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ mgs: 'Đăng kí thất bại' });
    } catch (error) {
        if (error.details) {
            const err = error.details.map((i) => i.mgs);
            return res.status(StatusCodes.BAD_REQUEST).json(err);
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: ERROR_MESSAGES.REQUIRED });
        }
        const user = await authModel.getUserEmail(email);
        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: ERROR_MESSAGES.WRONG_ACCOUNT });
        }
        if (user.role == 'ban') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: ERROR_MESSAGES.BAN });
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: ERROR_MESSAGES.WRONG_ACCOUNT });
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
        delete user.createdAt;
        delete user.updatedAt;
        return res
            .cookie('token_wow', token, tokenOption)
            .status(StatusCodes.OK)
            .json(user);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mgs: ERROR_MESSAGES.ERR_AGAIN,
            error: error,
        });
    }
};

const logout = async(req, res) => {
    return await res.clearCookie('token_wow').status(StatusCodes.OK).json({
        mgs: 'Đăng xuất thành công',
    });
};

const getOtp = async(req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                mgs: 'Thiếu thông tin email',
            });
        }
        const user = await authModel.getUserEmail(email);
        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Email không tồn tại' });
        }
        if (user.role == 'ban') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Tài khoản của bạn đang tạm khóa' });
        }
        const otp = Math.random().toString(36).slice(2, 8).toUpperCase();
        await authModel.updateByEmail(email, otp);
        await sendMail(email, otp);
        return res.status(StatusCodes.OK).json({
            mgs: 'Kiểm tra mã OTP trong gmail của bạn',
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mgs: 'Có lỗi xảy ra xin thử lại sau',
            error: error,
        });
    }
};

const checkOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Không bỏ trống thông tin email và mã otp' });
        }
        const user = await authModel.getUserEmail(email);
        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Email không tồn tại' });
        }
        if (user.role == 'ban') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Tài khoản của bạn đang tạm khóa' });
        }
        if (user.otp === otp) {
            return res
                .status(StatusCodes.OK)
                .json({ mgs: 'Nhập mật khẩu mới của bạn' });
        }
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ mgs: 'Mã otp không hợp lệ' });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mgs: 'Có lỗi xảy ra xin thử lại sau',
            error: error,
        });
    }
};

const changePassWordByOtp = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Không bỏ trống thông tin email hoặc password' });
        }
        const user = await authModel.getUserEmail(email);
        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Email không tồn tại' });
        }
        if (user.role == 'ban') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Tài khoản của bạn đang tạm khóa' });
        }

        const hash = await bcrypt.hashSync(password, 8);
        if (!hash) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ mgs: 'Có lỗi bảo mật xảy ra' });
        }
        const data = {
            password: hash,
        };
        const dataUser = await authModel.update(user._id.toString(), data);
        if (dataUser) {
            return res
                .status(StatusCodes.OK)
                .json({ mgs: 'Đổi mật khẩu thành công' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mgs: 'Có lỗi xảy ra xin thử lại sau',
            error: error,
        });
    }
};

export const authController = {
    getOtp,
    register,
    login,
    logout,
    checkOtp,
    changePassWordByOtp,
};