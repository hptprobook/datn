
import { authModel } from '~/models/authModel';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import { sendMail } from '~/utils/mail';
import { createToken } from '~/utils/helper';

const register = async(req, res) => {
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
            delete dataUser.password
            dataUser.token = createToken(dataUser);
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

const login = async(req, res) => {
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
            message: ERROR_MESSAGES.ERR_AGAIN,
            error: error,
        });
    }
};

const logout = async(req, res) => {
    return await res.clearCookie('token_wow').status(StatusCodes.OK).json({
        message: 'Đăng xuất thành công',
    });
};

const getOtp = async(req, res) => {
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

const checkOtp = async(req, res) => {
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

const changePassWordByOtp = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Không bỏ trống thông tin email hoặc password' });
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

export const authController = {
    getOtp,
    register,
    login,
    logout,
    checkOtp,
    changePassWordByOtp,
};