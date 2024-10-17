/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { userModel } from '~/models/userModel';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from '~/utils/errorMessage';
import path from 'path';
import { uploadModel } from '~/models/uploadModel';
const getCurrentUser = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await userModel.getUserID(user_id);
        delete user.password;
        if (user) {
            return res.status(StatusCodes.OK).json(user);
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
const createUser = async (req, res) => {
    try {
        const data = req.body;
        const existUser = await userModel.getUserEmail(data.email);
        if (existUser) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Email đã tồn tại' });
        }
        const hash = await bcrypt.hashSync(data.password, 8);
        if (!hash) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Có lỗi bảo mật xảy ra' });
        }
        data.password = hash;

        const result = await userModel.register(data);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ERROR_MESSAGES.ERR_AGAIN,
            error: error,
        });
    }
};

const getCurrentAdmin = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await userModel.getUserID(user_id);
        delete user.password;
        if (user) {
            return res.status(StatusCodes.OK).json(user);
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
        console.log(user);
        if (user) {
            return res.status(StatusCodes.OK).json(user);
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
        if (dataUser.error) {
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
        const { user_id } = req.user;
        const users = await userModel.getUserAll(pages, limit, user_id);
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
            const hash = await bcrypt.hashSync(data.password, 8);
            if (!hash) {
                return res

                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: 'Có lỗi bảo mật xảy ra' });
            }
            data.password = hash;
        }
        const dataUser = await userModel.update(id, data);
        if (dataUser) {
            return res.status(StatusCodes.OK).json(dataUser);
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
        const { role } = req.user;
        const dataUser = await userModel.deleteUser(id, role);
        if (dataUser.error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: dataUser.error });
        }
        if (dataUser) {
            return res
                .status(StatusCodes.OK)
                .json({ dataUser, message: 'Xóa người dùng thành công' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Có lỗi xảy ra xin thử lại sau',
            error: error,
        });
    }
};

const favoriteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { userId } = req.body;

        if (!id || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: ERROR_MESSAGES.REQUIRED,
            });
        }

        const favorite = await userModel.getFavorite(id, userId);
        if (favorite) {
            const result = await userModel.removeFavoriteProduct(id, userId);
            if (result.error) {
                return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
            }
            return res.status(StatusCodes.OK).json({
                message: 'Đã xóa danh sách yêu thích thành công',
            });
        } else {
            const result = await userModel.favoriteProduct(id, userId);
            if (result.error) {
                return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
            }
            return res.status(StatusCodes.OK).json({
                message: 'Đã thêm vào danh sách yêu thích thành công',
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
    }
};

const viewProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!id || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: ERROR_MESSAGES.REQUIRED,
            });
        }

        const view = await userModel.getView(id, userId);
        if (!view) {
            const result = await userModel.viewProduct(id, userId);
            if (result.error) {
                return res.status(StatusCodes.BAD_REQUEST).json(result.detail);
            }
            return res.status(StatusCodes.OK).json({
                message: 'Xem sản phẩm thành công',
            });
        } else {
            return res.sendStatus(StatusCodes.NO_CONTENT);
        }
    } catch (error) {
        console.log(error);

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message });
    }
};
// update Infor

const updateInfor = async (req, res) => {
    try {
        const { user_id } = req.user;
        if (!req.file) {
            const dataInfor = req.body;
            const result = await userModel.updateInfor(user_id, dataInfor);
            delete result.refreshToken;
            delete result.role;
            delete result.allowNotifies;
            delete result.createdAt;
            delete result.updatedAt;
            delete result.favorites;
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Cập nhật thông tin thành công', result });
        }
        const getUser = await userModel.getUserID(user_id);
        const file = req.file;
        const fileName = file.filename;
        const filePath = path.join('uploads/user', fileName);
        const dataInfor = {
            ...req.body,
            avatar: filePath,
        };
        const result = await userModel.updateInfor(user_id, dataInfor);
        delete result.refreshToken;
        delete result.role;
        delete result.allowNotifies;
        delete result.createdAt;
        delete result.updatedAt;
        delete result.favorites;
        if (result) {
            const fileGetUser = path.join(getUser.avatar);
            await uploadModel.deleteImg(fileGetUser);
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Cập nhật thông tin thành công', result });
        }
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Có lỗi xảy ra xin thử lại sau' });
    } catch (error) {
        if (req.file) {
            const file = req.file;
            const fileName = file.filename;
            const filePath = path.join('uploads/user', fileName);
            await uploadModel.deleteImg(filePath);
        }

        if (error.details) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: error.details[0].message,
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json(error);
    }
};

export const usersController = {
    getUserById,
    getCurrentUser,
    getCurrentAdmin,
    getUserByEmail,
    updateCurrentUser,
    updateUser,
    changePassWord,
    getAllUsers,
    deleteUser,
    favoriteProduct,
    createUser,
    viewProduct,
    updateInfor,
};
