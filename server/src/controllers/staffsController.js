
import { createStaffToken } from '~/utils/helper';
import { staffsModel } from '../models/staffsModel';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { timetableModel } from '~/models/timetableModel';
import { uploadModel } from '~/models/uploadModel';

const createStaff = async (req, res) => {
    try {
        const data = req.body;
        const existStaff = await staffsModel.getStaffBy('email', data.email);
        if (existStaff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email đã tồn tại',
            });
        }
        const existStaffCode = await staffsModel.getStaffBy('staffCode', data.staffCode);
        if (existStaffCode) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Mã nhân viên đã tồn tại',
            });
        }
        const hash = await bcrypt.hash(data.password, 8);
        data.password = hash;
        const result = await staffsModel.createStaff(data);
        res.status(StatusCodes.CREATED).json({
            result
        });
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const updateStaff = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const existStaff = await staffsModel.getStaffBy('_id', id);
        if (!existStaff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Nhân viên không tồn tại',
            });
        }
        const existEmail = await staffsModel.getStaffBy('email', data.email);
        if (existEmail && existEmail._id.toString() !== id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email đã tồn tại',
            });
        }
        if (data.phone) {
            const existPhone = await staffsModel.getStaffBy('phone', data.phone);
            if (existPhone && existPhone._id.toString() !== id) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Số điện thoại đã tồn tại',
                });
            }
        }
        const existStaffCode = await staffsModel.getStaffBy('staffCode', data.staffCode);
        if (existStaffCode && existStaffCode._id.toString() !== id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Mã nhân viên đã tồn tại',
            });
        }
        const result = await staffsModel.updateStaff(id, data);
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const existStaff = await staffsModel.getStaffBy('_id', id);
        if (!existStaff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Nhân viên không tồn tại',
            });
        }
        const result = await staffsModel.deleteStaff(id);
        res.status(StatusCodes.OK).json(result);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const getStaffBy = async (req, res) => {
    try {
        const { value } = req.params;
        const { by } = req.query;
        if (!by || by !== '_id' && by !== 'email' && by !== 'staffCode' && by !== 'cccd' && by !== 'bankAccount' && by !== 'phone') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu thông tin hoặc thông tin không hợp lệ',
            });
        }
        const staff = await staffsModel.getStaffBy(by, value);
        if (!staff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không tồn tại nhân viên',
            });
        }
        delete staff.password;
        res.status(200).json(staff);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const getMe = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { exp } = req.user;
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({
                message: 'Phiên đăng nhập hết hạn',
            });
        }
        if ((exp - (Date.now()/1000)) < 0) {
            const decodedToken = jwt.verify(refreshToken, process.env.SECRET_STAFF);
            if (!decodedToken) {
                return res.status(401).json({
                    message: 'Phiên đăng nhập hết hạn',
                });
            }
            const staff = await staffsModel.getStaffBy('_id', user_id);
            if (!staff) {
                return res.status(401).json({
                    message: 'Không tồn tại nhân viên',
                });
            }
            staff.token = createStaffToken(staff);
            delete staff.password;
            delete staff.refreshToken;
            return res.status(200).json(staff);
        }

        const staff = await staffsModel.getStaffBy('_id', user_id);
        if (!staff) {
            return res.status(401).json({
                message: 'Không tồn tại nhân viên',
            });
        }
        staff.token = createStaffToken(staff);
        delete staff.password;
        delete staff.refreshToken;
        res.status(StatusCodes.CREATED).json(staff);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Phiên đăng nhập hết hạn',
            });
        }
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const updateMe = async (req, res) => {
    try {
        const { user_id } = req.user;
        const data = req.body;
        const existStaff = await staffsModel.getStaffBy('_id', user_id);
        if (!existStaff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Nhân viên không tồn tại',
            });
        }
        if (data.phone) {
            const existPhone = await staffsModel.getStaffBy('phone', data.phone);
            if (existPhone && existPhone._id.toString() !== user_id) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Số điện thoại đã tồn tại',
                });
            }
        }
        if (req.file) {
            const file = req.file;
            const fileName = file.filename;
            const filePath = path.join('uploads/staffs', fileName);
            data.avatar = filePath;
        }

        if (data.password) {
            const hash = await bcrypt.hash(data.password, 8);
            data.password = hash;
        }
        const result = await staffsModel.updateMe(user_id, data);
        if (result.avatar && req.file) {
            await uploadModel.deleteImg(existStaff.avatar);
        }
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (error) {
        if (req.file) {
            await uploadModel.deleteImg(req.file.path);
        }
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const getStaffs = async (req, res) => {
    try {
        const staffs = await staffsModel.getStaffs();
        res.status(StatusCodes.OK).json(staffs);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const loginStaff = async (req, res) => {
    try {
        const { type, main, password } = req.body;
        if (!type || type !== 'email' && type !== 'staffCode' && type !== 'cccd' && type !== 'phone') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Tên đăng nhập không hợp lệ',
            });
        }
        const staff = await staffsModel.getStaffBy(type, main);
        if (!staff) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Tài khoản đăng nhập không tồn tại',
            });
        }

        const checkPass = await bcrypt.compare(password, staff.password);

        if (!checkPass) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Mật khẩu không đúng',
            });
        }
        const token = createStaffToken(staff);
        const refreshToken = createStaffToken(staff, 'refresh');
        const lastLogin = new Date();
        await staffsModel.updateMe(staff._id, { refreshToken, lastLogin });
        const tokenOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };
        staff.token = token;
        delete staff.password;
        delete staff.refreshToken;
        res.status(200).cookie('refreshToken', refreshToken, tokenOption).json(staff);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const logoutStaff = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const decodedToken = jwt.verify(refreshToken, process.env.SECRET_STAFF);
        await staffsModel.updateMe(decodedToken.user_id, { refreshToken: null });
        return await res.clearCookie('refreshToken').status(StatusCodes.OK).json({
            message: 'Đăng xuất thành công',
        });
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
const getTimetables = async (req, res) => {
    try {
        const { user_id } = req.user;
        const timetables = await timetableModel.findsBy({ value: user_id });
        res.status(StatusCodes.OK).json(timetables);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
        });
    }
}
export const staffsController = {
    createStaff,
    getStaffBy,
    getStaffs,
    loginStaff,
    getMe,
    logoutStaff,
    updateStaff,
    deleteStaff,
    getTimetables,
    updateMe
}